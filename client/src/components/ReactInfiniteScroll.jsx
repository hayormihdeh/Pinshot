import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

export default function ReactInfiniteScroll({
  dataLength,
  fetchData,
  hasMore,
  children,
}) {
  return (
    <InfiniteScroll
      dataLength={dataLength}
      next={fetchData}
      hasMore={hasMore}
      loader={
        <div className="d-flex  flex-column justify-content align-items-center">
          {' '}
          <ClipLoader />
          <p>Fetching pins</p>
        </div>
      }
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {children}
    </InfiniteScroll>
  );
}

ReactInfiniteScroll.propTypes = {
  children: PropTypes.node.isRequired,
  dataLength: PropTypes.number,
  fetchData: PropTypes.func,
  hasMore: PropTypes.bool,
};
