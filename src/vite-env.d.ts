/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

// Explicit Vue module declaration to fix TypeScript resolution
declare module 'vue' {
    export * from '@vue/runtime-dom';
    export * from '@vue/runtime-core';
    export * from '@vue/reactivity';

    // Explicitly export lifecycle hooks
    export {
        onBeforeMount,
        onMounted,
        onBeforeUpdate,
        onUpdated,
        onBeforeUnmount,
        onUnmounted,
        onActivated,
        onDeactivated,
        onErrorCaptured,
        onRenderTracked,
        onRenderTriggered,
        onServerPrefetch
    } from '@vue/runtime-core';
}

// Vue i18n global properties
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $t: (key: string, ...args: any[]) => string;
        $tc: (key: string, choice?: number, ...args: any[]) => string;
        $te: (key: string) => boolean;
        $d: (value: number | Date, ...args: any[]) => string;
        $n: (value: number, ...args: any[]) => string;
        $tm: (key: string) => any;
    }
}
