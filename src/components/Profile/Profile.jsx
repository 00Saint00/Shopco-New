import React from "react";
import { Tab } from "@headlessui/react";
import ProfileInfo from "./ProfileInfo";
// import Orders from "./Orders";

const Profile = () => {
  return (
    <div className="flex flex-col lg:flex-row px-[16px] lg:px-[100px] pt-[80px] pb-[90%] lg:pb-[168px]">
      <Tab.Group className="w-full">
        <div className="flex flex-col lg:flex-row w-full">
          {/* Sidebar / Top nav */}
          <Tab.List className="w-full lg:w-44 lg:border-r lg:pr-6 mb-6 lg:mb-0">
            <ul className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4 overflow-x-auto">
              <li>
                <Tab
                  className={({ selected }) =>
                    `block px-4 py-2 rounded ${
                      selected ? "bg-black text-white font-bold" : ""
                    }`
                  }
                >
                  Profile
                </Tab>
              </li>
              <li>
                <Tab
                  className={({ selected }) =>
                    `block px-4 py-2 rounded ${
                      selected ? "bg-black text-white font-bold" : ""
                    }`
                  }
                >
                  Orders
                </Tab>
              </li>
              <li>
                <Tab
                  className={({ selected }) =>
                    `block px-4 py-2 rounded ${
                      selected ? "bg-black text-white font-bold" : ""
                    }`
                  }
                >
                  Wishlist
                </Tab>
              </li>
              <li>
                <Tab
                  className={({ selected }) =>
                    `block px-4 py-2 rounded ${
                      selected ? "bg-black text-white font-bold" : ""
                    }`
                  }
                >
                  Settings
                </Tab>
              </li>
            </ul>
          </Tab.List>

          {/* Main content */}
          <Tab.Panels className="flex-1 lg:pl-8 w-full">
            <Tab.Panel>
              <div>
                <ProfileInfo />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div>{/* <Orders /> */}</div>
            </Tab.Panel>
            <Tab.Panel>
              <div>Your wishlist here</div>
            </Tab.Panel>
            <Tab.Panel>
              <div>Change password / settings</div>
            </Tab.Panel>
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
};

export default Profile;
