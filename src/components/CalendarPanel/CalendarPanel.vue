<script setup lang="ts">
import { computed, defineProps, withDefaults } from 'vue';
import { getDefault } from '../../utils/defaults';
import useCommons, { MonthPage } from '../../composables/useCommons';
import {
  definePopoverEvents,
  PopoverPosition,
  PopoverVisibility,
} from '../../composables/usePopover';
import CalendarPanelWeeks, {
  WeeknumbersVisibility,
} from './CalendarPanelWeeks.vue';
import CalendarDay from '../CalendarDay/CalendarDay.vue';

export interface CalendarPanelOptions {
  page: MonthPage;
  position: number;
  titlePosition: PopoverPosition;
  navVisibility?: PopoverVisibility;

  row: number;
  rowFromEnd: number;
  column: number;
  columnFromEnd: number;

  showWeeknumbers: boolean | WeeknumbersVisibility;
  showIsoWeeknumbers: boolean | WeeknumbersVisibility;
}

const props = withDefaults(defineProps<CalendarPanelOptions>(), {
  navVisibility: () => getDefault('navVisibility'),
});

const { navPopoverId } = useCommons();

// calculate the position for the popover
const navPlacement = computed(() => {
  if (props.titlePosition === 'left') return 'bottom-start';
  if (props.titlePosition === 'right') return 'bottom-end';
  return 'bottom';
});

// keep the events in sync
const navEvents = computed(() => {
  const { page, position } = props;
  return definePopoverEvents({
    id: navPopoverId,
    // TODO: puede haber mejor manera de pasar la informacion
    data: { page, position },
    placement: navPlacement.value,
    visibility: props.navVisibility,
    modifiers: [{ name: 'flip', options: { fallbackPlacements: ['bottom'] } }],
    // isInteractive: true, // ?
  });
});
</script>

<template>
  <div
    :class="[
      'vc-pane',
      `row-from-end-${props.rowFromEnd}`,
      `column-from-end-${props.columnFromEnd}`,
    ]"
  >
    <!-- Panel Header -->
    <slot name="header" :page="props.page">
      <div :class="['vc-header', `align-${props.titlePosition}`]">
        <div class="vc-title" v-on="navEvents">
          <slot name="header-title" :page="props.page">
            {{ props.page.title }}
          </slot>
        </div>
      </div>
    </slot>

    <!-- Panel Content -->
    <CalendarPanelWeeks :days="props.page.days" v-bind="props">
      <template #week-day="day">
        <CalendarDay :day="day" v-bind="$attrs">
          <!-- pass slot -->
          <template #day-content>
            <slot name="day-content" :day="day" />
          </template>
        </CalendarDay>
      </template>
    </CalendarPanelWeeks>
  </div>
</template>
