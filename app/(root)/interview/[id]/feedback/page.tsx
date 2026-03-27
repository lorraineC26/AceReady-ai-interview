import { getCurrentUser } from '@/lib/actions/auth.action';
import { getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/general.action';
import { redirect } from 'next/navigation';

const page = async ({params}:RouteParams) => {
  const {id} = await params; // interview id
  const user = await getCurrentUser();

  // interview id is passed
  const interview = await getInterviewById(id);
  if(!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  console.log("feedback", feedback);

  return (
    <div>page</div>
  )
}

export default page