import { account, tables, ID, config } from "../lib/appwrite";

export const registerUser = async ({ name, email, password, avatar }) => {
  try {
    // Create new account
    const newAccount = await account.create(ID.unique(), email, password, name);

    // Delete any existing sessions (including guest sessions) before creating new one
    try {
      await account.deleteSessions();
    } catch (e) {
      // Ignore if no sessions exist or if user doesn't have permission
    }

    // Create session FIRST (required for updatePrefs)
    const session = await account.createEmailPasswordSession(email, password);
    const token = session.$id;

    // Now update preferences (requires active session)
    // await account.updatePrefs({ avatar: avatar || null });
    await account.updatePrefs({ avatar: avatar || null, role: "customer" });

    // Get updated user data (after prefs update)
    const user = await account.get();

    // Create user row in table
    try {
      console.log("🔍 Attempting to create row with:", {
        databaseId: config.databaseId,
        tableId: config.usersTableId,
        rowId: newAccount.$id,
        data: {
          name: newAccount.name || name,
          email: newAccount.email,
          role: "customer",
          status: "active",
          avatarUrl: user.prefs?.avatar || avatar || null,
        },
      });

      const rowResult = await tables.createRow({
        databaseId: config.databaseId, // database ID
        tableId: config.usersTableId, // table ID
        rowId: newAccount.$id, // row ID (use user ID from created account)
        data: {
          name: newAccount.name || name,
          email: newAccount.email,
          role: "customer",
          status: "active",
          avatarUrl: user.prefs?.avatar || avatar || null,
        },
      });
      console.log("✅ User row created in table:", rowResult);
    } catch (dbError) {
      // Handle 409 conflict - user already exists
      if (dbError.code === 409) {
        console.error("❌ User already exists in database");
        // Delete the account we just created since user already exists
        try {
          await account.delete();
        } catch (deleteError) {
          console.error("Error deleting duplicate account:", deleteError);
        }
        return {
          success: false,
          error: "User already exists. Please login instead.",
        };
      } else {
        console.error("❌ Database creation error:", dbError);
        console.error("❌ Error code:", dbError.code);
        console.error("❌ Error message:", dbError.message);
        console.error("❌ Full error:", JSON.stringify(dbError, null, 2));
        // Continue even if database creation fails - user account is still created
      }
    }

    return {
      success: true,
      user: {
        uid: user.$id,
        name: user.name || name,
        email: user.email,
        role: "customer",
        status: "active",
        avatar: user.prefs?.avatar || avatar || null,
      },
      token,
    };

    // return { success: true, user: userData, token };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async ({ email, password }) => {
  try {
    // Try to create new email session
    let session;
    try {
      session = await account.createEmailPasswordSession(email, password);
    } catch (sessionError) {
      // If "session already active" error, delete sessions and retry
      if (
        sessionError.message?.includes("session is active") ||
        sessionError.code === 409
      ) {
        try {
          await account.deleteSessions();
          // Retry creating session after deleting old ones
          session = await account.createEmailPasswordSession(email, password);
        } catch (retryError) {
          throw retryError;
        }
      } else {
        throw sessionError;
      }
    }

    const token = session.$id;

    // Get current user data
    const user = await account.get();

    // Fetch role from database table (usersTableId) - role is stored as enum in database
    let userRole = "customer"; // default
    try {
      const userRow = await tables.getRow({
        databaseId: config.databaseId,
        tableId: config.usersTableId,
        rowId: user.$id,
      });
      userRole = userRow?.role || "customer";
    } catch (error) {
      console.error("Error fetching user role from database:", error);
      // Default to "customer" if row doesn't exist
    }

    // Map Appwrite user to your expected structure
    const userData = {
      uid: user.$id,
      name: user.name || email.split("@")[0],
      email: user.email,
      role: userRole, // ✅ Get role from database table (enum)
      avatar: user.prefs?.avatar || null,
    };

    //if seller,fetch seller data

    try {
      const sellerRow = await tables.getRow({
        databaseId: config.databaseId,
        tableId: config.sellersTableId,
        rowId: user.$id,
      });
      userData.shopName = sellerRow?.shopName || "";
      userData.shopUrl = sellerRow?.shopUrl || "";
      userData.contactEmail = sellerRow?.contactEmail || "";
      userData.contactPhone = sellerRow?.contactPhone || "";
      userData.shopAddress = sellerRow?.shopAddress || "";
      userData.verified = sellerRow?.verified || false;
      userData.applicationStatus = sellerRow?.applicationStatus || "";

      if (
        sellerRow?.applicationStatus === "approved" &&
        userData?.role !== "seller"
      ) {
        try {
          // OLD CODE - Update role in prefs (commented out - role is stored in database, not prefs)
          // await account.updatePrefs({ role: "seller" });

          // Update role in database table (role is stored as enum in database, not prefs)
          try {
            await tables.updateRow({
              databaseId: config.databaseId,
              tableId: config.usersTableId,
              rowId: user.$id,
              data: { role: "seller" },
            });
            console.log("✅ Role updated in usersTable");
          } catch (updateError) {
            // If row doesn't exist, create it
            if (
              updateError.code === 404 ||
              updateError.message?.includes("not found")
            ) {
              console.log("Row doesn't exist, creating it...");
              await tables.createRow({
                databaseId: config.databaseId,
                tableId: config.usersTableId,
                rowId: user.$id,
                data: {
                  name: user.name || email.split("@")[0],
                  email: user.email,
                  role: "seller",
                },
              });
              console.log("✅ Role created in usersTable");
            } else {
              console.error("Error updating role in usersTable:", updateError);
            }
          }

          userData.role = "seller";
        } catch (error) {
          console.error("error updating role to seller:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching seller data:", error);
    }

    return { success: true, user: userData, token };
  } catch (error) {
    console.error("🔍 Login error:", error);
    return { success: false, error: error.message };
  }
};

export const logoutUsers = async () => {
  try {
    await account.deleteSession("current");
    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    return { session: false, error: error.message };
  }
};

export const updateUserProfile = async ({
  phone,
  address,
  city,
  state,
  country,
}) => {
  try {
    //get current user
    const user = await account.get();
    const userId = user.$id; // get user id since its what we want to use

    //this is used to because we dont want to pass empty data
    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (country !== undefined) updateData.country = country;

    try {
      const rowResult = await tables.updateRow({
        databaseId: config.databaseId,
        tableId: config.customersTableId,
        rowId: userId,
        data: updateData,
      });
      return {
        success: true,
        message: "User profile updated successfully",
        user: {
          ...user,
          ...updateData,
        },
        rowResult,
      };
    } catch (error) {
      if (error.code === 404 || error.message?.includes("not found")) {
        const rowResult = await tables.createRow({
          databaseId: config.databaseId,
          tableId: config.customersTableId,
          rowId: userId,
          data: updateData,
        });
        return {
          success: true,
          message: "User Profile Created Successfully",
          user: {
            ...user,
            ...updateData,
          },
          rowResult,
        };
      } else {
        return {
          success: false,
          error: error.message,
        };
      }
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateSellersProfile = async ({
  city,
  shopName,
  shopUrl,
  contactEmail,
  contactPhone,
  shopAddress,
  verified,
}) => {
  try {
    const user = await account.get();
    const userId = user.$id;

    const updateData = {};
    if (city !== undefined) updateData.city = city;
    if (shopName !== undefined) updateData.shopName = shopName;
    if (shopUrl !== undefined) updateData.shopUrl = shopUrl;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (shopAddress !== undefined) updateData.shopAddress = shopAddress;
    if (verified !== undefined) updateData.verified = verified;

    // await account.updatePrefs({ role: "seller" });

    try {
      const rowResult = await tables.updateRow({
        databaseId: config.databaseId,
        tableId: config.sellersTableId,
        rowId: userId,
        data: updateData,
      });
      return {
        success: true,
        message: "Seller profile updated successfully",
        user: {
          ...user,
          ...updateData,
        },
        rowResult,
      };
    } catch (error) {
      if (error.code === 404 || error.message?.includes("not found")) {
        const rowResult = await tables.createRow({
          databaseId: config.databaseId,
          tableId: config.sellersTableId,
          rowId: userId,
          data: {
            ...updateData,
            applicationStatus: "pending", // ADD THIS
          },
        });
        return {
          success: true,
          message:
            "Seller application submitted successfully. Awaiting approval.",
          user: {
            ...user,
            ...updateData,
          },
          rowResult,
        };
      } else {
        return {
          success: false,
          error: error.message,
        };
      }
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
