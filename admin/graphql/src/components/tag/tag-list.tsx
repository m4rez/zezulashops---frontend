// @ts-nocheck
import Pagination from '@/components/ui/pagination';
import { Table } from '@/components/ui/table';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import {
  Tag,
  TagPaginator,
  QueryTagsOrderByColumn,
  SortOrder,
} from '__generated__/__types__';
import { useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { NoDataFound } from '@/components/icons/no-data-found';

export type IProps = {
  tags: TagPaginator | undefined | null;
  onPagination: (key: number) => void;
  refetch: Function;
};

const TagList = ({ tags, onPagination, refetch }: IProps) => {
  const { t } = useTranslation();
  const { data, paginatorInfo } = tags! ?? {};
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft } = useIsRTL();

  const [order, setOrder] = useState<SortOrder>(SortOrder.Desc);
  const [column, setColumn] = useState<string>();

  const debouncedHeaderClick = useMemo(
    () =>
      debounce((value) => {
        setColumn(value);
        setOrder(order === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc);
        refetch({
          orderBy: [
            {
              column: value,
              order: order === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
            },
          ],
        });
      }, 300),
    [order]
  );

  const onHeaderClick = (value: string | undefined) => ({
    onClick: () => {
      debouncedHeaderClick(value);
    },
  });

  const columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-id')}
          ascending={
            order === SortOrder.Asc && column === QueryTagsOrderByColumn.Id
          }
          isActive={column === QueryTagsOrderByColumn.Id}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
      width: 180,
      onHeaderCell: () => onHeaderClick(QueryTagsOrderByColumn.Id),
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            order === SortOrder.Asc && column === QueryTagsOrderByColumn.Name
          }
          isActive={column === QueryTagsOrderByColumn.Name}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 220,
      onHeaderCell: () => onHeaderClick(QueryTagsOrderByColumn.Name),
    },
    {
      title: t('table:table-item-slug'),
      dataIndex: 'slug',
      key: 'slug',
      align: 'center',
      width: 250,
      ellipsis: true,
    },
    {
      title: t('table:table-item-group'),
      dataIndex: 'type',
      key: 'type',
      align: alignLeft,
      width: 250,
      render: (type: any) => (
        <div
          className="overflow-hidden truncate whitespace-nowrap"
          title={type?.name}
        >
          {type?.name}
        </div>
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: 'right',
      width: 120,
      render: (slug: string, record: Tag) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_TAG"
          routes={Routes?.tag}
        />
      ),
    },
  ];

  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          //@ts-ignore
          data={data}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => '',
            rowExpandable: rowExpandable,
          }}
        />
      </div>

      {!!paginatorInfo.total && (
        <div className="flex justify-end items-center">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default TagList;
