import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SettingsPage from "@/components/settings-page";

export default async function Settings() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <SettingsPage />;
}
