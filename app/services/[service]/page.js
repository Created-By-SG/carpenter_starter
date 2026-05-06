import { services } from '@/data/services';
import ServicePageTemplate from '@/components/ServicePageTemplate';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ service: slug }));
}

export async function generateMetadata({ params }) {
  const service = services[params.service];
  if (!service) return {};
  return {
    title: `${service.title} | Starter Carpentry | Gold Coast`,
    description: service.excerpt || service.opening?.[0] || '',
  };
}

export default function ServicePage({ params }) {
  const service = services[params.service];
  if (!service) notFound();
  return <ServicePageTemplate service={service} />;
}
