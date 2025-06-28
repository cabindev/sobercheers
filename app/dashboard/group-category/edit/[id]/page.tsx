import { notFound } from 'next/navigation';
import { getGroupCategoryById } from '../../actions/Get';
import GroupCategoryForm from '../../components/GroupCategoryForm';

interface EditGroupCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditGroupCategoryPage({ params }: EditGroupCategoryPageProps) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    notFound();
  }

  try {
    const category = await getGroupCategoryById(categoryId);

    if (!category) {
      notFound();
    }

    return (
      <GroupCategoryForm
        initialData={{
          id: category.id,
          name: category.name,
          description: category.description || '',
        }}
        isEdit={true}
      />
    );
  } catch (error) {
    console.error('Error loading category:', error);
    notFound();
  }
}
