import CreateTokenForm from '@/components/shared/CreateTokenForm'
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

const AddTokenPage = async () => {
    const { userId } = auth();

  if(!userId) redirect("/sign-in");


  const user = await getUserById(userId);
  return (
    <>
        <CreateTokenForm userId={user._id} creditBalance={user.creditBalance} />
    </>
  )
}

export default AddTokenPage