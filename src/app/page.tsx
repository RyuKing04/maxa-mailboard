import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // o "/register" o "/dashboard"
}
