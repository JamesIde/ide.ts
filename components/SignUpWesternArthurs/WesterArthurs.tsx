import Image from "next/image";
import {
  IoFolder,
  IoBarChartOutline,
  IoBodySharp,
  IoCloudDownload,
} from "react-icons/io5";

import * as mailchimp from "@mailchimp/mailchimp_marketing";
import { useState } from "react";
import baseClient from "config/baseClient";
import { addEmailToAudienceList } from "lib/api/api";
import SignUpNow from "./SignUpNow";

function WesternArthursWaitList() {
  return (
    <div className="border-2 w-full p-4 mt-4 mb-4 border-green-200 bg-green-50 rounded">
      <div>
        <h1 className="font-bold text-xl text-black text-center leading-tight tracking-tight">
          The Western Arthurs Walking App
        </h1>
        <div className="flex flex-col-reverse xl:flex-row gap-5">
          <div>
            <p className="mt-2 mb-2 text-center font-bold text-2xl">
              A brand new app is coming your way.
            </p>
            <p className="mt-2 mb-2">
              The Western Arthurs Walking app is your all-inclusive resource for
              undertaking this stunning journey.
            </p>
            <div className="flex flex-row mb-4">
              <IoFolder size={80} color="#012447" />
              <div className="ml-4">
                <h3 className="font-bold text-[#012447] text-2xl">
                  Get all information
                </h3>
                <p>
                  Discover resources and guides that encompass everything about
                  the Western Arthurs.
                </p>
              </div>
            </div>
            <div className="flex flex-row mb-4">
              <IoBarChartOutline size={80} color="#00815b" />
              <div className="ml-4">
                <h3 className="font-bold text-[#00815b] text-2xl">
                  Detailed tracking statistics
                </h3>
                <p>
                  See your location on the trail and distance to the campsites
                  as you walk with realtime updates.
                </p>
              </div>
            </div>
            <div className="flex flex-row mb-4">
              <IoBodySharp size={100} color="#03848d" />
              <div className="ml-4">
                <h3 className="font-bold text-[#03848d] text-2xl">
                  See areas of interest
                </h3>
                <p>
                  Use the custom markers to see points of interest on the trail
                  like alternative campsites, water sources, mobile coverage,
                  and potential hazards.
                </p>
              </div>
            </div>
            <div className="flex flex-row mb-2">
              <IoCloudDownload size={100} color="#d45a03" />
              <div className="ml-4">
                <h3 className="font-bold text-[#d45a03] text-2xl">
                  Offline Capability
                </h3>
                <p>
                  Have a peace of mind knowing the app works offline as you
                  venture into the wilderness, far beyond reception.
                </p>
              </div>
            </div>
            <div>
              <p className="font-bold mt-2">
                Planning a traverse this year? You'll need this app.
              </p>
              <p className="mt-2 mb-2">
                Sign up below to be notified when the app is available.
              </p>
            </div>
            <SignUpNow />
          </div>

          <div className="mt-8">
            <Image
              src={"/assets/wawa/wat-ss.png"}
              height={100}
              width={800}
              alt="Western Arthurs"
              quality={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default WesternArthursWaitList;

//
// us21
