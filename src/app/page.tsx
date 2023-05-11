import { cx } from 'class-variance-authority';
import { type Metadata } from 'next';
import Link from 'next/link';
import { GitHubLogo } from '~/icons/github-logo';

type Indicator = 'critical' | 'major' | 'minor' | 'none';
const theme: Record<Indicator, string> = {
  critical: 'bg-red-500 text-red-50',
  major: 'bg-red-500/80 text-red-50',
  minor: 'bg-yellow-500/40 text-yellow-900',
  none: 'bg-green-500/40 text-green-900',
};

async function getStatusData() {
  const res = await fetch('https://www.githubstatus.com/api/v2/status.json', {
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch status from GitHub Status');
  }

  return res.json() as unknown as { status: { indicator: Indicator; description: string } };
}

export default async function Home() {
  const {
    status: { indicator, description },
  } = await getStatusData();

  function GetStatusMessageFromIndicator(indicator: Indicator) {
    switch (indicator) {
      case 'critical':
        return SelectRandomItem(['Without a doubt', 'It almost certainly is', 'Definitely Yes']);
      case 'major':
        return SelectRandomItem(['Yes', 'All signs point to Yes', 'As I see it, Yes']);
      case 'minor':
        return SelectRandomItem(['Likely', 'Possibly', 'Probably']);
      default:
        return SelectRandomItem([`Doesn't seem to be`, 'Seems to be Working', 'Apparently Not', 'My sources say no']);
    }
  }

  function SelectRandomItem(items: string[]) {
    return items.at(Math.floor(Math.random() * items.length));
  }

  return (
    <main
      className={cx('min-w-screen flex min-h-screen flex-col items-center justify-center gap-8 px-6', theme[indicator])}
    >
      <div className="flex flex-col items-center gap-4">
        <GitHubLogo className="h-16 w-16 md:h-32 md:w-32" />
        <h1 className="text-2xl font-semibold md:text-3xl">Is GitHub Down?</h1>
      </div>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-3xl font-bold md:text-5xl">{GetStatusMessageFromIndicator(indicator)}</h2>
        <p className="text-center text-base">
          GitHub is currently reporting their status as{' '}
          <Link href="https://www.githubstatus.com" target="_blank">
            <b>&apos;{description}&apos;</b>
          </Link>
        </p>
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const {
    status: { indicator },
  } = await getStatusData();

  let color = 'green';
  if (indicator === 'critical' || indicator === 'major') {
    color = 'red';
  } else if (indicator === 'minor') {
    color = 'yellow';
  }

  return {
    icons: [{ url: `/assets/${color}-icon-256x256.png`, sizes: '256x256' }],
  };
}
