"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {

  const [profile, setProfile] =
    useState<any>({});

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    const loadProfile =
      async () => {

        const user =
          JSON.parse(
            localStorage.getItem("user")
            || "{}"
          );

        const response =
          await fetch(
            `/api/profile/${user.id}`
          );

        const data =
          await response.json();

        setProfile(data);
      };

    loadProfile();

  }, []);

  const saveProfile =
    async () => {

      setLoading(true);

      const user =
        JSON.parse(
          localStorage.getItem("user")
          || "{}"
        );

      await fetch(
        `/api/profile/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({

            Phone__c:
              profile.Phone__c,

            Address__c:
              profile.Address__c,

            City__c:
              profile.City__c,

            State__c:
              profile.State__c,

            Pincode__c:
              profile.Pincode__c,

          }),
        }
      );

      alert(
        "Profile Updated ✅"
      );

      setLoading(false);
    };

  return (
    <main className="
    min-h-screen
    bg-black
    text-white
    ">

      <div className="
      max-w-3xl
      mx-auto
      p-10
      ">

        <h1 className="
        text-5xl
        font-bold
        mb-10
        ">
          My Profile 👤
        </h1>

        <div className="space-y-4">

          <input
            value={profile.Name || ""}
            disabled
            className="w-full p-4 rounded bg-zinc-900"
          />

          <input
            value={profile.Email__c || ""}
            disabled
            className="w-full p-4 rounded bg-zinc-900"
          />

          <input
            placeholder="Phone"
            value={profile.Phone__c || ""}
            onChange={(e)=>
              setProfile({
                ...profile,
                Phone__c:
                  e.target.value,
              })
            }
            className="w-full p-4 rounded bg-zinc-900"
          />

          <input
            placeholder="Address"
            value={profile.Address__c || ""}
            onChange={(e)=>
              setProfile({
                ...profile,
                Address__c:
                  e.target.value,
              })
            }
            className="w-full p-4 rounded bg-zinc-900"
          />

          <input
            placeholder="City"
            value={profile.City__c || ""}
            onChange={(e)=>
              setProfile({
                ...profile,
                City__c:
                  e.target.value,
              })
            }
            className="w-full p-4 rounded bg-zinc-900"
          />

          <input
            placeholder="State"
            value={profile.State__c || ""}
            onChange={(e)=>
              setProfile({
                ...profile,
                State__c:
                  e.target.value,
              })
            }
            className="w-full p-4 rounded bg-zinc-900"
          />

          <input
            placeholder="Pincode"
            value={profile.Pincode__c || ""}
            onChange={(e)=>
              setProfile({
                ...profile,
                Pincode__c:
                  e.target.value,
              })
            }
            className="w-full p-4 rounded bg-zinc-900"
          />

          <button
            onClick={saveProfile}
            disabled={loading}
            className="
            w-full
            bg-blue-600
            p-4
            rounded-xl
            "
          >
            Save Profile
          </button>

        </div>

      </div>

    </main>
  );
}