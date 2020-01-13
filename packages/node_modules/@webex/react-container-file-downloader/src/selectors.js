import {createSelector} from 'reselect';

const getSpark = (state, ownProps) => ownProps.sparkInstance || state.spark.get('spark');
const getShare = (state) => state.share;

const getContainerProps = createSelector(
  [getSpark, getShare],
  (spark, share) => (
    {
      share,
      spark
    }
  )
);

export default getContainerProps;
