import Link from "next/dist/client/link";
import { useRouter } from "next/router";

const MyLink = ({ href, name, ...rest }) => {
  const { asPath } = useRouter();
  return (
    <Link href={href} passHref legacyBehavior>
      <a
        {...rest}
        className="text-blue-600 text-lg font-semibold hover:translate-x-[5px] transition-all transform ease-out duration-300"
      >
        {name}
      </a>
    </Link>
  );
};

export default MyLink;
