# Dropdown Menu Component

A reusable standalone dropdown component with two item patterns:

1. `itemListDropdown` array for config-driven items.
2. `dropdownMenuItem` template directive for custom content.

## Files
- `dropdown-menu.component.ts`
- `dropdown-menu-item.directive.ts`

## Usage

Import `DropdownMenuComponent` into a standalone or module-based parent. If you want to use `dropdownMenuItem`, also import `DropdownMenuItemDirective` in the parent component's imports.

### 1. Config array items

```html
<app-dropdown-menu
  [buttonLabel]="'Menu'"
  [buttonIcon]="'home'"
  [itemListDropdown]="dropdownItems"
  [customItemsPosition]="'before'"
  (selected)="onDropdownSelected($event)"
></app-dropdown-menu>
```

```ts
dropdownItems = [
  {
    label: 'Dashboard',
    iconLeft: 'home',
    routeUrl: '/dashboard',
  },
  {
    label: 'Meu Perfil',
    iconLeft: 'user',
    routeUrl: ['/portal-do-utente', 'perfil-utente'],
  },
  {
    label: 'Sair',
    iconLeft: 'logout',
    click: () => this.logout(),
  },
];

onDropdownSelected(event: { item: any; index: number }) {
  console.log('Item selecionado', event.item, event.index);
}
```

### 2. Custom template items

```html
<app-dropdown-menu [buttonLabel]="'Ações'" [customItemsPosition]="'before'">
  <ng-template dropdownMenuItem [dropdownMenuItemOrder]="0" let-closeMenu="closeMenu">
    <button type="button" class="w-full px-4 py-3 text-left hover:bg-[#F8F3EE]" (click)="closeMenu()">
      <span class="font-semibold">Item customizado</span>
    </button>
  </ng-template>

  <ng-template dropdownMenuItem [dropdownMenuItemOrder]="1" let-closeMenu="closeMenu">
    <button type="button" class="w-full px-4 py-3 text-left hover:bg-[#F8F3EE]" (click)="doCustomAction(); closeMenu()">
      Ação personalizada
    </button>
  </ng-template>
</app-dropdown-menu>
```

### 3. Mixed usage

The component supports both `itemListDropdown` and `dropdownMenuItem` at the same time. Custom items are rendered in the order defined by `dropdownMenuItemOrder`, and their placement is controlled by `customItemsPosition`.

### 4. Custom trigger template

You can replace the default button trigger with a custom toggle using the `dropdownMenuTrigger` directive.

```html
<app-dropdown-menu [customItemsPosition]="'before'">
  <ng-template dropdownMenuTrigger let-toggleMenu="toggleMenu" let-menuOpen="menuOpen" let-ariaLabel="ariaLabel">
    <button
      type="button"
      class="flex items-center gap-2 rounded-full h-10 px-4 bg-[#F18700] text-white"
      [attr.aria-expanded]="menuOpen"
      [attr.aria-label]="ariaLabel"
      (click)="toggleMenu()"
    >
      Ações personalizadas
    </button>
  </ng-template>

  <ng-template dropdownMenuItem [dropdownMenuItemOrder]="0" let-closeMenu="closeMenu">
    <button type="button" class="w-full px-4 py-3 text-left hover:bg-[#F8F3EE]" (click)="closeMenu()">
      Item customizado
    </button>
  </ng-template>
</app-dropdown-menu>
```

The custom trigger receives:

- `toggleMenu` – function to open/close the dropdown
- `menuOpen` – current open state
- `ariaLabel` – computed aria-label for the trigger

## Inputs
- `ariaLabel` (`string`) – aria label for the dropdown toggle.
- `buttonLabel` (`string`) – text shown on the open button.
- `buttonIcon` (`'home' | 'user' | 'logout' | 'settings' | 'check' | 'arrowRight' | 'chevronRight' | 'info'`) – icon shown on the button.
- `itemListDropdown` (`DropdownMenuItemConfig[]`) – array of menu item configs.
- `customItemsPosition` (`'before' | 'after'`) – position of custom template items relative to config items.
- `closeOnSelect` (`boolean`) – whether the dropdown closes automatically after selection.
- `menuMaxWidth` (`string`) – max width for the dropdown panel, e.g. `'320px'`.
- `menuMinWidth` (`string`) – min width for the dropdown panel, defaults to `'220px'`.
- `variante` (`'padrao' | 'escuro'`) – panel skin. `padrao` is the light panel shown above; `escuro` is the institutional navigation skin (green panel, white text, items separated by hairlines), used by the site header.

### 5. Dark navigation variant

Combine `variante="escuro"` with a custom trigger to reproduce the header submenu:

```html
<app-dropdown-menu variante="escuro" menuMinWidth="270px" [itemListDropdown]="itens">
  <ng-template dropdownMenuTrigger let-toggleMenu="toggleMenu" let-menuOpen="menuOpen">
    <button type="button" [attr.aria-expanded]="menuOpen" (click)="toggleMenu()">Sobre a UNAGRO</button>
  </ng-template>
</app-dropdown-menu>
```

```ts
itens = [{ label: 'Nossa História', routeUrl: '/sobre', iconRight: 'chevronRight' }];
```

## Outputs
- `selected` – emits when a configured menu item is clicked.

## Notes
- Use the custom template directive when you need flexible markup or items with custom actions.
- Config items support both `routeUrl` navigation and direct `click()` callbacks.
- Custom template items receive `closeMenu` in the template context so they can close the dropdown manually.
