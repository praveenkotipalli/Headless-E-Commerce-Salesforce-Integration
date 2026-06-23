"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {

  const router = useRouter();

  const [profile, setProfile] =
  useState<any>(null);

  const [useSavedAddress,
  setUseSavedAddress] =
  useState(true);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "UPI",
    });

        useEffect(() => {

  const loadProfile =
    async () => {

      const user =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );

      const response =
        await fetch(
          `/api/profile/${user.id}`
        );

      const data =
        await response.json();

      setProfile(data);

      setForm({
        name: data.Name || "",
        phone: data.Phone__c || "",
        address: data.Address__c || "",
        city: data.City__c || "",
        state: data.State__c || "",
        pincode: data.Pincode__c || "",
        paymentMethod: "UPI",
      });

    };

  loadProfile();

}, []);
  const handleCheckout =
    async () => {

      setLoading(true);

      const user =
        JSON.parse(
          localStorage.getItem("user") || "{}"
        );

      await new Promise(
        resolve =>
          setTimeout(resolve, 2000)
      );


      const payload = {

  customerId: user.id,

  shippingName:
    useSavedAddress
      ? profile.Name
      : form.name,

  shippingPhone:
    useSavedAddress
      ? profile.Phone__c
      : form.phone,

  shippingAddress:
    useSavedAddress
      ? profile.Address__c
      : form.address,

  shippingCity:
    useSavedAddress
      ? profile.City__c
      : form.city,

  shippingState:
    useSavedAddress
      ? profile.State__c
      : form.state,

  shippingPincode:
    useSavedAddress
      ? profile.Pincode__c
      : form.pincode,

  paymentMethod:
    form.paymentMethod,

};

      const response =
        await fetch(
          "/api/orders",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({

  customerId: user.id,

  shippingName:
    useSavedAddress
      ? profile.Name
      : form.name,

  shippingPhone:
    useSavedAddress
      ? profile.Phone__c
      : form.phone,

  shippingAddress:
    useSavedAddress
      ? profile.Address__c
      : form.address,

  shippingCity:
    useSavedAddress
      ? profile.City__c
      : form.city,

  shippingState:
    useSavedAddress
      ? profile.State__c
      : form.state,

  shippingPincode:
    useSavedAddress
      ? profile.Pincode__c
      : form.pincode,

  paymentMethod:
    form.paymentMethod,

}),
          }
        );

      const data =
        await response.json();

      if (data.success) {

        router.push(
          `/order-success?orderId=${data.orderId}`
        );

      } else {

        alert(
          data.error ||
          "Checkout failed"
        );

      }

      setLoading(false);
    };

  return (
    <main className="
    min-h-screen
    bg-black
    text-white
    ">

      <div className="
      max-w-2xl
      mx-auto
      p-8
      ">

        <h1 className="
        text-5xl
        font-bold
        mb-10
        ">
          Checkout 💳
        </h1>

        <div className="mb-6">

  <label className="flex gap-2">

    <input
      type="radio"
      checked={useSavedAddress}
      onChange={() =>
        setUseSavedAddress(true)
      }
    />

    Use Saved Address

  </label>

  <label className="flex gap-2 mt-2">

    <input
      type="radio"
      checked={!useSavedAddress}
      onChange={() =>
        setUseSavedAddress(false)
      }
    />

    Use Different Address

  </label>

</div>

{
  useSavedAddress &&
  profile && (

    <div
      className="
      bg-zinc-900
      rounded-xl
      p-5
      mb-5
      "
    >

      <h2 className="font-bold">
        Saved Address
      </h2>

      <p>
        Name:- {profile.Name}
      </p>

      <p>
        Phone Number:- {profile.Phone__c}
      </p>

      <p>
        Address:- {profile.Address__c}
      </p>

      <p>
        City:- {profile.City__c}
      </p>

      <p>
        State:- {profile.State__c}
      </p>

      <p>
        Pincode:- {profile.Pincode__c}
      </p>


        <p>
            Payment Method:- 
        </p>
      <select
            className="w-full p-4 rounded mb-6 bg-zinc-900"
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({
                ...form,
                paymentMethod:
                  e.target.value,
              })
            }
          >
            <option>
              UPI
            </option>

            <option>
              Credit Card
            </option>

            <option>
              Cash On Delivery
            </option>

          </select>

    </div>

  )
}

        { !useSavedAddress &&

            <div className="space-y-4">

          <input
            placeholder="Full Name"
            className="w-full p-4 rounded bg-zinc-900"
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
          <input
            placeholder="Phone Number"
            className="w-full p-4 rounded bg-zinc-900"
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Address"
            className="w-full p-4 rounded bg-zinc-900"
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
          />

          <input
            placeholder="City"
            className="w-full p-4 rounded bg-zinc-900"
            onChange={(e) =>
              setForm({
                ...form,
                city: e.target.value,
              })
            }
          />

          <input
            placeholder="State"
            className="w-full p-4 rounded bg-zinc-900"
            onChange={(e) =>
              setForm({
                ...form,
                state: e.target.value,
              })
            }
          />

          <input
            placeholder="Pincode"
            className="w-full p-4 rounded bg-zinc-900"
            onChange={(e) =>
              setForm({
                ...form,
                pincode: e.target.value,
              })
            }
          />

          <select
            className="w-full p-4 rounded mb-6 bg-zinc-900"
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({
                ...form,
                paymentMethod:
                  e.target.value,
              })
            }
          >
            <option>
              UPI
            </option>

            <option>
              Credit Card
            </option>

            <option>
              Cash On Delivery
            </option>

          </select>

          

        </div>
        
        }
        <button
            onClick={
              handleCheckout
            }
            disabled={loading}
            className="
            w-full
            bg-blue-600
            p-4
            rounded-xl
            text-xl
            "
          >
            {loading
              ? "Processing Payment..."
              : "Pay Now"}
          </button>

      </div>

    </main>
  );
}