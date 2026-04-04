import { redirect } from 'next/navigation';
import { Route } from '@plutus/libs/config/routes';

export default function Home() {
  redirect(Route.Campaigns);
}
