import { SliderStateOptions } from 'react-stately';
import './ScrubbingBar.styles.scss';
export interface IScrubbingBarProps extends Partial<SliderStateOptions<number[]>> {
    numberFormatOptions?: unknown;
}
export declare const ScrubbingBar: ({ ...rest }: IScrubbingBarProps) => JSX.Element;
//# sourceMappingURL=ScrubbingBar.d.ts.map