import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* =========================
   TypeScript Type
========================= */

type FormData = {
  email: string;
  phone: string;
  paymentMethod: "Card" | "UPI";
  cardNumber?: string;
  cvv?: string;
  upiId?: string;
  terms: boolean;
};

/* =========================
   Yup Schema
========================= */

const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),

  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone must be exactly 10 digits")
    .required("Phone number is required"),

  paymentMethod: yup
    .string()
    .oneOf(["Card", "UPI"])
    .required("Select payment method"),

  cardNumber: yup.string().when("paymentMethod", {
    is: "Card",
    then: (schema) =>
      schema
        .required("Card number is required")
        .matches(/^[0-9]{16}$/, "Card number must be 16 digits"),
    otherwise: (schema) => schema.notRequired(),
  }),

  cvv: yup.string().when("paymentMethod", {
    is: "Card",
    then: (schema) =>
      schema
        .required("CVV is required")
        .matches(/^[0-9]{3}$/, "CVV must be 3 digits"),
    otherwise: (schema) => schema.notRequired(),
  }),

  upiId: yup.string().when("paymentMethod", {
    is: "UPI",
    then: (schema) =>
      schema
        .required("UPI ID is required")
        .matches(
          /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/,
          "Invalid UPI format"
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  terms: yup
    .boolean()
    .oneOf([true], "Accept Terms & Conditions"),
});

/* =========================
   Component
========================= */

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = (data: FormData) => {
    console.log(data);
    alert("Form Submitted Successfully");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Checkout Form</h1>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Email */}
        <div>
          <label>Email</label>
          <br />
          <input {...register("email")} />
          <p>{errors.email?.message}</p>
        </div>

        {/* Phone */}
        <div>
          <label>Phone Number</label>
          <br />
          <input {...register("phone")} />
          <p>{errors.phone?.message}</p>
        </div>

        {/* Payment Method */}
        <div>
          <label>Payment Method</label>
          <br />

          <select {...register("paymentMethod")}>
            <option value="">Select</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>

          <p>{errors.paymentMethod?.message}</p>
        </div>

        {/* Card Fields */}
        {paymentMethod === "Card" && (
          <>
            <div>
              <label>Card Number</label>
              <br />
              <input {...register("cardNumber")} />
              <p>{errors.cardNumber?.message}</p>
            </div>

            <div>
              <label>CVV</label>
              <br />
              <input {...register("cvv")} />
              <p>{errors.cvv?.message}</p>
            </div>
          </>
        )}

        {/* UPI Field */}
        {paymentMethod === "UPI" && (
          <div>
            <label>UPI ID</label>
            <br />
            <input {...register("upiId")} />
            <p>{errors.upiId?.message}</p>
          </div>
        )}

        {/* Terms */}
        <div>
          <label>
            <input type="checkbox" {...register("terms")} />
            Accept Terms & Conditions
          </label>

          <p>{errors.terms?.message}</p>
        </div>

        <button type="submit">
          Submit
        </button>

      </form>
    </div>
  );
}

export default App;