import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import ShippingList from '@/components/shipping/shipping-list';
import Search from '@/components/common/search';

import LinkButton from '@/components/ui/link-button';
import { useShippingClassesQuery } from '@/graphql/shipping.graphql';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import {
  QueryShippingClassesOrderByColumn,
  Shipping,
  SortOrder,
} from '__generated__/__types__';
import { Routes } from '@/config/routes';
import PageHeading from '@/components/common/page-heading';

export default function ShippingsPage() {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useShippingClassesQuery({
    variables: {
      orderBy: [
        {
          column: QueryShippingClassesOrderByColumn.UpdatedAt,
          order: SortOrder.Desc,
        },
      ],
    },
    fetchPolicy: 'network-only',
  });
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    refetch({
      text: `%${searchText}%`,
    });
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-shippings')} />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-1/2">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
          />

          <LinkButton
            href={`${Routes.shipping.create}`}
            className="h-12 w-full md:w-auto md:ms-6"
          >
            <span>
              + {t('form:button-label-add')} {t('form:button-label-shipping')}
            </span>
          </LinkButton>
        </div>
      </Card>
      <ShippingList
        shippings={data?.shippingClasses as Shipping[]}
        refetch={refetch}
      />
    </>
  );
}
ShippingsPage.authenticate = {
  permissions: adminOnly,
};
ShippingsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
