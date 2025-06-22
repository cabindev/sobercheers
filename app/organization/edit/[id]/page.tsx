// app/organization/edit/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getOrganizationById } from '../../actions/Get';
import { getActiveOrganizationCategories } from '@/app/dashboard/organization-category/actions/Get';
import OrganizationForm from '../../components/OrganizationForm';

interface EditOrganizationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditOrganizationPage({ params }: EditOrganizationPageProps) {
  const { id } = await params;
  const organizationId = parseInt(id);

  if (isNaN(organizationId)) {
    notFound();
  }

  try {
    const [organization, organizationCategories] = await Promise.all([
      getOrganizationById(organizationId),
      getActiveOrganizationCategories()
    ]);

    if (!organization) {
      notFound();
    }

    return (
      <OrganizationForm
        organizationCategories={organizationCategories}
        initialData={{
          firstName: organization.firstName,
          lastName: organization.lastName,
          organizationCategoryId: organization.organizationCategoryId,
          organizationCategory: organization.organizationCategory,
          addressLine1: organization.addressLine1,
          district: organization.district,
          amphoe: organization.amphoe,
          province: organization.province,
          zipcode: organization.zipcode,
          type: organization.type,
          phoneNumber: organization.phoneNumber,
          numberOfSigners: organization.numberOfSigners,
          image1: organization.image1,
          image2: organization.image2,
          image3: organization.image3,
          image4: organization.image4,
          image5: organization.image5
        }}
        isEdit={true}
      />
    );
  } catch (error) {
    console.error('Error loading organization:', error);
    notFound();
  }
}