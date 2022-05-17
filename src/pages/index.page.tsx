import { useRouter } from 'next/router';

export default function Home() {
  console.log(useRouter());
  return <div>Hello React.js Testing Series Friends!!!</div>;
}
