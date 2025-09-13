import { notFound } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Apartment } from "@/types/apartment";
import KribiAnimations from '@/components/kribi-animations';
import ApartmentDetails from '@/components/home-screen/apartment-details';

interface AboutPageProps {
  params: {
    id: string;
  };
}

const AboutPage = async ({ params }: AboutPageProps) => {
  const apartmentId = params.id;

  if (!apartmentId) {
    notFound();
  }

  const docRef = doc(db, "apartments", apartmentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const data = docSnap.data();
  const apartmentData: Apartment = {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Apartment;

  return (
    <KribiAnimations>
      <ApartmentDetails apartment={apartmentData} />
    </KribiAnimations>
  );
};

export default AboutPage;