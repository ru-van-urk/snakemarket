<script setup lang="ts">
  import {
    Dialog,
    DialogOverlay,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
    TransitionChild,
    TransitionRoot,
  } from "@headlessui/vue";
  import { XMarkIcon } from "@heroicons/vue/24/outline";
  import { ChevronDownIcon } from "@heroicons/vue/24/solid";
  import { useState } from "nuxt/app";
  import { cn } from "~/utils/helpers";
  import useFilters from "~/composables/useFilters";
  import useSort from "~/composables/useSort";
  import { sortTypes } from "~/composables/useSort";

  const open = useState("open", () => false);

  const filters = useFilters();
  const [sort, setSort] = useSort();
</script>

<template>
  <div class="bg-gray-50">
    <!-- Mobile filter dialog -->
    <TransitionRoot as="template" :show="open">
      <Dialog
        as="div"
        class="fixed inset-0 flex z-40 sm:hidden"
        @close="open = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="translate-x-full"
        >
          <div
            class="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-6 flex flex-col overflow-y-auto"
          >
            <div class="px-4 flex items-center justify-between">
              <h2 class="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                class="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @click="open = false"
              >
                <span class="sr-only">Close menu</span>
                <XMarkIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <!-- Filters -->
            <form class="mt-4">
              <Disclosure
                as="div"
                v-for="section in filters"
                :key="section.name"
                class="border-t border-gray-200 px-4 py-6"
                v-slot="{ open }"
              >
                <h3 class="-mx-2 -my-3 flow-root">
                  <DisclosureButton
                    class="px-2 py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400"
                  >
                    <span class="font-medium text-gray-900">
                      {{ section.name }}
                    </span>
                    <span class="ml-6 flex items-center">
                      <ChevronDownIcon
                        :class="
                          cn(
                            open ? '-rotate-180' : 'rotate-0',
                            'h-5 w-5 transform'
                          )
                        "
                        aria-hidden="true"
                      />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel class="pt-6">
                  <div class="space-y-6">
                    <div
                      v-for="(option, optionIdx) in section.options"
                      :key="option.value"
                      class="flex items-center"
                    >
                      <input
                        :id="`filter-mobile-${section.id}-${optionIdx}`"
                        v-model="option.checked"
                        type="checkbox"
                        class="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        :for="`filter-mobile-${section.id}-${optionIdx}`"
                        class="ml-3 text-sm text-gray-500"
                      >
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                </DisclosurePanel>
              </Disclosure>
            </form>
          </div>
        </TransitionChild>
      </Dialog>
    </TransitionRoot>

    <div class="mx-auto text-center px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="filter-heading" class="py-6 container mx-auto">
        <div class="flex items-center justify-between">
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton
                class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sorteer op
                <ChevronDownIcon
                  class="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="origin-top-left absolute left-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hover:bg-red-100 group"
              >
                <div class="py-1 cursor-pointer">
                  <MenuItem v-for="option in sortTypes" :key="option">
                    <span
                      @click="() => setSort(option)"
                      class="flex w-full justify-between items-center"
                    >
                      <p
                        class="block px-4 py-2 text-sm font-medium text-gray-900 group-hover:text-slate-600"
                      >
                        {{ option }}
                      </p>

                      <ChevronDownIcon
                        v-if="sort && option === sort.type"
                        :class="
                          cn(
                            'flex-shrink-0 h-5 w-5 text-gray-400 mr-2',
                            sort.sortOrder === 'DES' && 'rotate-180'
                          )
                        "
                        aria-hidden="true"
                      />
                    </span>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <button
            type="button"
            class="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
            @click="open = true"
          >
            Filters
          </button>

          <PopoverGroup class="hidden sm:flex sm:items-baseline sm:space-x-8">
            <Popover
              as="div"
              v-for="filter in filters"
              :key="filter.name"
              id="desktop-menu"
              class="relative inline-block text-left"
            >
              <div>
                <PopoverButton
                  class="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>{{ filter.name }}</span>

                  <ChevronDownIcon
                    class="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </PopoverButton>
              </div>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <PopoverPanel
                  class="origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl p-4 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                >
                  <div class="space-y-4" v-if="filter.options.length > 0">
                    <div
                      v-for="option in filter.options"
                      :key="option.value"
                      class="flex items-center"
                    >
                      <input
                        :id="`filter-${filter.id}-${option.value}`"
                        v-model="option.checked"
                        type="checkbox"
                        class="h-4 w-4 border-gray-300 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                      <label
                        :for="`filter-${filter.id}-${option.value}`"
                        class="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap cursor-pointer"
                      >
                        {{ option.label }}
                      </label>
                    </div>
                  </div>
                  <div v-else>Er zijn geen aanbiedingen deze week</div>
                </PopoverPanel>
              </transition>
            </Popover>
          </PopoverGroup>
        </div>
      </section>
    </div>
  </div>
</template>
