<script lang="ts" generics="TData, TValue">
  import {
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel
  } from '@tanstack/table-core';
  import { createSvelteTable, FlexRender } from '$components/ui/data-table';
  import * as Table from '$components/ui/table';
  import { Input } from '$components/ui/input';
  import { ArrowDownAZ, ArrowUpZA } from 'lucide-svelte';

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onRowClick?: (row: TData) => void;
  };

  let { data, columns, onRowClick }: DataTableProps<TData, TValue> = $props();

  let sorting = $state<SortingState>([]);
  let columnFilters = $state<ColumnFiltersState>([]);

  const table = createSvelteTable({
    get data() {
      return data;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        sorting = updater(sorting);
      } else {
        sorting = updater;
      }
    },
    onColumnFiltersChange: (updater) => {
      if (typeof updater === 'function') {
        columnFilters = updater(columnFilters);
      } else {
        columnFilters = updater;
      }
    },
    state: {
      get sorting() {
        return sorting;
      },
      get columnFilters() {
        return columnFilters;
      }
    }
  });
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2 py-4">
    <Input
      placeholder="Filter by patient name..."
      value={(table.getColumn('patient')?.getFilterValue() as string) ?? ''}
      onchange={(e) => {
        table.getColumn('patient')?.setFilterValue(e.currentTarget.value);
      }}
      oninput={(e) => {
        table.getColumn('patient')?.setFilterValue(e.currentTarget.value);
      }}
      class="max-w-sm"
    />
  </div>
  <div class="rounded-md border mx-8">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head colspan={header.colSpan}>
                {#if !header.isPlaceholder}
                  <button
                    onclick={header.column.getToggleSortingHandler()}
                    class="flex items-center gap-2 hover:opacity-70 cursor-pointer"
                  >
                    <FlexRender
                      content={header.column.columnDef.header}
                      context={header.getContext()}
                    />
                    {#if header.column.getIsSorted() === 'asc'}
                      <ArrowUpZA class="h-4 w-4" />
                    {:else if header.column.getIsSorted() === 'desc'}
                      <ArrowDownAZ class="h-4 w-4" />
                    {/if}
                  </button>
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row
            data-state={row.getIsSelected() && 'selected'}
            onclick={() => onRowClick?.(row.original)}
            class="cursor-pointer hover:bg-muted"
          >
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell
                style={cell.column.columnDef.size !== 150
                  ? `width: ${cell.column.columnDef.size}px; min-width: ${cell.column.columnDef.size}px; max-width: ${cell.column.columnDef.size}px;`
                  : ''}
              >
                <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</div>
