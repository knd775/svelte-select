---
'svelte-select': minor
---

Add generic types. `items` infers the item type, and `value`, `itemId`, `label`, the snippets and the callbacks follow from it. `itemId` and `label` now only accept keys of the item, and `value` narrows to the item, its id (`valueMode="id"`) or an array of either (`multiple`). Item and value types are exported from the package root.
