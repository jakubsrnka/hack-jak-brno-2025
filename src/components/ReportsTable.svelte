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
  import { ArrowDownAZ, ArrowUpZA, Check, ChevronsUpDown } from 'lucide-svelte';
  import { type PatientsResponse } from '$types/pocketbase';
  import { Skeleton } from '$components/ui/skeleton';
  import * as Popover from '$components/ui/popover';
  import * as Command from '$components/ui/command';
  import { Button } from '$components/ui/button';
  import { cn } from '$lib/utils';

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onRowClick?: (row: TData) => void;
    patients: Promise<PatientsResponse[]>;
  };

  let { data, columns, onRowClick, patients }: DataTableProps<TData, TValue> = $props();

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

  let selectedPatients = $state<string[]>([]);
  let open = $state(false);
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2">
    {#await patients}
      <Skeleton class="h-10 w-[200px]" />
    {:then patientsList}
      <Popover.Root bind:open>
        <Popover.Trigger>
          <Button
            variant="outline"
            class="w-[200px] justify-between"
            role="combobox"
            aria-expanded={open}
          >
            {selectedPatients.length > 0
              ? `${selectedPatients.length} selected`
              : 'Select patients...'}
            <ChevronsUpDown class="ms-2 size-4 shrink-0 opacity-50" />
          </Button>
        </Popover.Trigger>
        <Popover.Content class="w-[200px] p-0">
          <Command.Root>
            <Command.Input placeholder="Search patients..." />
            <Command.List>
              <Command.Empty>No patients found.</Command.Empty>
              <Command.Group>
                {#each patientsList as patient (patient.uuid)}
                  <Command.Item
                    value={patient.uuid}
                    onSelect={() => {
                      selectedPatients = selectedPatients.includes(patient.uuid)
                        ? selectedPatients.filter((uuid) => uuid !== patient.uuid)
                        : [...selectedPatients, patient.uuid];
                    }}
                  >
                    <Check
                      class={cn(
                        'me-2 size-4',
                        selectedPatients.includes(patient.uuid) ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {patient.uuid}
                  </Command.Item>
                {/each}
              </Command.Group>
            </Command.List>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
    {/await}
  </div>
  <div class="rounded-md border">
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
          {#if selectedPatients.length === 0 || selectedPatients.includes((row.original as any).expand.patient.uuid)}
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
          {/if}
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
</div>
