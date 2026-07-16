import Register from "@/modules/auth/Register/Register";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{
    ref?: string;
  }>;
}) {

  const params =
    await searchParams;

  return (
    <Register
      referralCode={
        params.ref ?? ""
      }
    />
  );

}