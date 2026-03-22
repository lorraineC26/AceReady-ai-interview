import Agent from '@/components/Agent';
import { getCurrentUser } from '@/lib/actions/auth.action';

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3>Interview Generation</h3>

      {/* type `generate` to create an interview; type `take` to participate */}
      <Agent userName = {user?.name!} userId = {user?.id} type="generate"/>
    </>
  )
}

export default Page