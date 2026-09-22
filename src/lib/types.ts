/** Shape of `bind:value`: the whole item, or just its `itemId` value. */
export type ValueMode = 'item' | 'id';

/** Shape primitive items (strings, numbers…) take once the component converts them. */
export interface ConvertedItem<Item> {
    index: number;
    value: Item;
    label: string;
}

/** An item as the component sees it — objects pass through, primitives are converted. */
export type ObjectItem<Item> = Item extends object ? Item : ConvertedItem<Item>;

/** Fields the component adds to items while grouping. */
export interface ListItemMeta {
    groupHeader?: boolean;
    groupItem?: boolean;
    selectable?: boolean;
    id?: string;
}

/** An item in the filtered list, including anything grouping added to it. */
export type ListItem<Item> = ObjectItem<Item> & ListItemMeta;

/** Keys of `Item` that can name an id or a label. */
export type ItemKey<Item> = keyof ObjectItem<Item> & string;

/**
 * `Preferred` when `Item` has it, every key otherwise, so `itemId`/`label` can default to
 * `'value'`/`'label'` without demanding those keys of items that name their fields differently.
 */
export type DefaultItemKey<Item, Preferred extends string> = [Extract<ItemKey<Item>, Preferred>] extends [never]
    ? ItemKey<Item>
    : Extract<ItemKey<Item>, Preferred>;

/** A single selection: the item itself, or its id under `valueMode="id"`. */
export type Selection<Item, ItemId extends ItemKey<Item>, Mode extends ValueMode> = Item extends object
    ? Mode extends 'id'
        ? ObjectItem<Item>[ItemId]
        : Item
    : Item;

/** What `bind:value` holds — an array of selections when `multiple`. */
export type SelectValue<
    Item,
    ItemId extends ItemKey<Item>,
    Mode extends ValueMode,
    Multiple extends boolean,
> = Multiple extends true ? Selection<Item, ItemId, Mode>[] : Selection<Item, ItemId, Mode>;

export interface SelectError {
    type: string;
    details: unknown;
}

export type LoadOptions<Item> = (filterText: string) => Promise<Item[] | { cancelled: true } | null | undefined>;

export type ItemFilter<Item, Label extends ItemKey<Item>> = (
    label: ObjectItem<Item>[Label],
    filterText: string,
    item: ListItem<Item>,
) => boolean;

export interface FilterArgs<
    Item,
    ItemId extends ItemKey<Item>,
    Label extends ItemKey<Item>,
    Mode extends ValueMode,
    Multiple extends boolean,
> {
    // Always passed, undefined when unset, so the built-in filter can destructure it.
    loadOptions: LoadOptions<Item> | undefined;
    filterText: string;
    items: Item[] | null;
    multiple: boolean;
    value: SelectValue<Item, ItemId, Mode, Multiple> | undefined;
    itemId: ItemId;
    label: Label;
    groupBy: ((item: ListItem<Item>) => string | undefined) | undefined;
    filterSelectedItems: boolean;
    itemFilter: ItemFilter<Item, Label>;
    convertStringItemsToObjects: (items: unknown[]) => ListItem<Item>[];
    filterGroupedItems: (items: ListItem<Item>[]) => ListItem<Item>[];
}

/** Replacement for the built-in filtering, passed as the `filter` prop. */
export type Filter<
    Item,
    ItemId extends ItemKey<Item>,
    Label extends ItemKey<Item>,
    Mode extends ValueMode,
    Multiple extends boolean,
> = (args: FilterArgs<Item, ItemId, Label, Mode, Multiple>) => ListItem<Item>[];

export interface GetItemsArgs<Item> {
    onerror: ((error: SelectError) => void) | undefined;
    onloaded: ((event: { items: ListItem<Item>[] }) => void) | undefined;
    loadOptions: LoadOptions<Item>;
    convertStringItemsToObjects: (items: unknown[]) => ListItem<Item>[];
    filterText: string;
}

export interface GetItemsResult<Item> {
    filteredItems: ListItem<Item>[];
    loading: boolean;
    focused: boolean;
    listOpen: boolean;
}

/** Replacement for the built-in async loading, passed as the `getItems` prop. */
export type GetItems<Item> = (args: GetItemsArgs<Item>) => Promise<GetItemsResult<Item> | undefined>;
