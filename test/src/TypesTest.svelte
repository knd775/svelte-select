<!--
    Type-level tests. Nothing here is mounted; `npm run check` is what runs it — the file fails
    the build if inference on items/value/itemId/label regresses.
-->
<script lang="ts">
    import type { ComponentProps } from 'svelte';
    import Select, { type ItemKey, type ListItem, type SelectValue } from '../../src/lib/Select.svelte';

    type Product = { id: number; title: string; group?: string };

    const products: Product[] = [{ id: 1, title: 'One' }];
    const strings = ['one', 'two'];

    // Items with the default itemId/label shape.
    const defaults = [{ value: 'one', label: 'One' }];
    let defaultValue = $state<{ value: string; label: string }>();

    // Custom itemId/label, value is the whole item.
    let product = $state<Product>();

    // valueMode="id" narrows value to the type of the item's id field.
    let productId = $state<number>();

    // Primitive items keep primitive values without valueMode.
    let text = $state<string>();

    // multiple lifts the value to an array.
    let chosen = $state<Product[]>();

    function handleSelect(selection: ListItem<Product>) {
        return selection.title;
    }

    type ProductProps = ComponentProps<typeof Select<Product, 'id', 'title'>>;

    const valid: ProductProps = { items: products, itemId: 'id', label: 'title' };

    // @ts-expect-error itemId must name a key of the item
    const badItemId: ProductProps = { items: products, itemId: 'nope', label: 'title' };

    // @ts-expect-error label must name a key of the item
    const badLabel: ProductProps = { items: products, itemId: 'id', label: 'nope' };

    // @ts-expect-error a string id is not this item's id type
    const badIdValue: SelectValue<Product, 'id', 'id', false> = 'one';

    // @ts-expect-error unknown keys are not item keys
    const badKey: ItemKey<Product> = 'nope';

    const okKey: ItemKey<Product> = 'title';

    void [valid, badItemId, badLabel, badIdValue, badKey, okKey];
</script>

<Select items={defaults} bind:value={defaultValue} />

<Select items={products} itemId="id" label="title" bind:value={product} onselect={handleSelect}>
    {#snippet item({ item, index })}
        {index}: {item.title}
    {/snippet}
    {#snippet list({ filteredItems })}
        {filteredItems.map((filtered) => filtered.title).join(', ')}
    {/snippet}
</Select>

<Select items={products} itemId="id" label="title" valueMode="id" bind:value={productId} />

<Select items={strings} bind:value={text} />

<Select items={products} itemId="id" label="title" multiple bind:value={chosen} />
