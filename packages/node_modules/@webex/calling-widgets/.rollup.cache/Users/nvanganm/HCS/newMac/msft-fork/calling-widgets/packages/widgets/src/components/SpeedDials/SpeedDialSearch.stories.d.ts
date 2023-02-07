/// <reference types="react" />
import { ComponentMeta, ComponentStory } from '@storybook/react';
declare const _default: ComponentMeta<({ items, className, onSearch, onAdd, onPress, }: {
    className?: string | undefined;
    items?: import("@webex-int/adapter-interfaces").ISpeedDialRecord[] | undefined;
    onSearch?: ((value: string) => void) | undefined;
    onAdd?: ((item: import("./SpeedDials.types").ISpeedDialItem) => void) | undefined;
    onPress?: ((item: import("./SpeedDials.types").ISpeedDialItem) => void) | undefined;
}) => JSX.Element>;
export default _default;
export declare const Default: ComponentStory<({ items, className, onSearch, onAdd, onPress, }: {
    className?: string | undefined;
    items?: import("@webex-int/adapter-interfaces").ISpeedDialRecord[] | undefined;
    onSearch?: ((value: string) => void) | undefined;
    onAdd?: ((item: import("./SpeedDials.types").ISpeedDialItem) => void) | undefined;
    onPress?: ((item: import("./SpeedDials.types").ISpeedDialItem) => void) | undefined;
}) => JSX.Element>;
//# sourceMappingURL=SpeedDialSearch.stories.d.ts.map