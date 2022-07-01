import { GetServerSideProps } from 'next'
import { parseCookies } from 'nookies'

export default function AccountPage() {
  return (
    <div>
      AccountPage
    </div>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { token } = parseCookies(context.req.cookies)
//   console.log("token", token)
//   return {
//     props: {

//     }
//   }
// }