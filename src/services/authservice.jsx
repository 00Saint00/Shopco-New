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
          role: user.prefs?.role || "customer",
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
          role: user.prefs?.role || "customer",
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
        role: user.prefs?.role || "customer",
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

    // Map Appwrite user to your expected structure
    const userData = {
      uid: user.$id,
      name: user.name || email.split("@")[0],
      email: user.email,
      role: user.prefs?.role || "customer",
      avatar: user.prefs?.avatar || null,
    };

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
