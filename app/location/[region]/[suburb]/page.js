import { suburbs } from '@/data/suburbs';
import SuburbPageTemplate from '@/components/SuburbPageTemplate';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return Object.values(suburbs).map((s) => ({
    region: s.region,
    suburb: s.slug,
  }));
}

export async function generateMetadata({ params }) {
  const suburb = suburbs[params.suburb];
  if (!suburb) return {};
  return {
    title: `Carpentry and Renovations in ${suburb.name} | Starter Carpentry`,
    description: suburb.intro || '',
  };
}

export default function SuburbPage({ params }) {
  const suburb = suburbs[params.suburb];
  if (!suburb) notFound();
  return <SuburbPageTemplate suburb={suburb} />;
}
