// pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import LogoutButton from "../components/LogoutButton/LogoutButton";

export default function Home({ user }) {
  const router = useRouter();

  useEffect(() => {
    // If the user is authenticated, redirect to the dashboard
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div>
        <h1>Welcome {user?.name}</h1>
        <LogoutButton />
      </div>
    );
  }

  return <div>Loading...</div>;  
}

export async function getServerSideProps(context) {
  const cookie = context.req.headers.cookie || "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth`, {
    headers: {
      cookie,
    },
  });

  const data = await res.json();


  if (data.isAuthenticated) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }


  if (!data.isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: data.user || null,
    },
  };
}
