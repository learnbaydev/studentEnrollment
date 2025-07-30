import RegisterNewUser from "@/components/RegisterNewUser/RegisterNewUser";
import { useSearchParams } from "next/navigation";
import React from "react";

const register = () => {
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  return (
    <>
      <RegisterNewUser email={email} />
    </>
  );
};

export default register;
