import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import '../style/demo.less';

const Demo1 = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [startIndex, setStartIndex] = useState(0); //  开始索引
  const [endIndex, setEndIndex] = useState(0); // 结束索引
  const [screenHeight, setScreenHeight] = useState(0); // 可视区域高度
  const [itemSize] = useState(60); // 每项高度
  const [listData, setListData] = useState<any[]>([]); // 所有列表数组
  const [startOffset, setStartOffset] = useState(0); // 偏移量

  /**
   * @desc 计算属性
   */
  // 总高度
  const listHeight = useMemo(() => listData.length * itemSize, [itemSize, listData.length]);

  // 真实显示的列表数据
  const visibleData = useMemo(
    () => listData.slice(startIndex, Math.min(endIndex, listData.length)),
    [endIndex, listData, startIndex]
  );

  // 可显示的列表项数
  const visibleCount = useMemo(() => Math.ceil(screenHeight / itemSize), [itemSize, screenHeight]);

  useEffect(() => {
    // 初始化假数据
    setListData(
      Array(20000)
        .fill(0)
        .map((_, i) => ({ id: i, value: `第${i + 1}条数据内容` }))
    );

    const dom = contentRef.current;

    if (dom) {
      setTimeout(() => {
        setScreenHeight(dom.clientHeight);
        setStartIndex(0);
        setEndIndex(0 + Math.ceil(dom.clientHeight / itemSize));
      }, 0);
    }
  }, [itemSize]);

  const onScroll = useCallback(() => {
    const container = contentRef.current;
    if (container) {
      // 当前滚动位置
      const scrollTop = container.scrollTop;
      // 开始索引
      const start = Math.floor(scrollTop / itemSize);
      const end = start + visibleCount;
      setStartIndex(start);
      setEndIndex(end);
      // 更新偏移量
      setStartOffset(scrollTop - (scrollTop % itemSize));
    }
  }, [itemSize, visibleCount]);

  return (
    <div ref={contentRef} className="infinite-list-container" onScroll={onScroll}>
      {/* 容器的占位div，高度为总列表高度，用于生成滚动条 */}
      <div className="infinite-list-phantom" style={{ height: `${listHeight}px` }} />
      {/* 可视列表，实际渲染列表  */}

      <div className="infinite-list" style={{ transform: `translate3d(0, ${startOffset}px, 0)` }}>
        {visibleData.map(item => (
          <div
            key={item.id}
            className="infinite-list-item"
            style={{ height: `${itemSize}px`, lineHeight: `${itemSize}px`, textAlign: 'center' }}
          >
            {item.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Demo1);

// https://ufresh2013.github.io/2020/04/26/%E8%99%9A%E6%8B%9F%E5%88%97%E8%A1%A8/
