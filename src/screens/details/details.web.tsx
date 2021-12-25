import React, { FC, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PortalHost, PortalProvider } from '@gorhom/portal';

import { CoordinatorContext } from 'components/coordinator/coordinator-context';
import { Box, Text, useTheme } from 'components/theme';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';

import { BookMainInfo } from './components/book-main-info';

interface Props {
  initialTab: number;
  tabs: any[];
  book: Book & BookExtended;
  isExist: boolean;
  fantlabId?: string;
  navigation: any;
}

export const BookDetails: FC<Props> = ({ tabs, book, initialTab, isExist, fantlabId, navigation }) => {
  const extraProps = useMemo(() => ({ book, isExist, fantlabId, navigation }), [book, fantlabId, isExist]);
  const scrollRef = useRef<HTMLDivElement>();
  const scrollContext = useMemo<any>(
    () => ({
      scrollTo(y: number) {
        scrollRef.current.scrollTop = y;
      },
    }),
    [],
  );

  return (
    <CoordinatorContext.Provider value={scrollContext}>
      <PortalProvider>
        <Box style={s.container} ref={scrollRef}>
          <BookMainInfo book={book} />
          <Tabs tabs={tabs} initialTab={initialTab} extraProps={extraProps} />
          <PortalHost name='fixed' />
        </Box>
      </PortalProvider>
    </CoordinatorContext.Provider>
  );
};

function Tabs({ tabs, initialTab, extraProps }) {
  const tabsRef = useRef<HTMLDivElement>();
  const [selected, setSelected] = useState(initialTab);
  const route = tabs[selected];
  const Component = route.component;

  useLayoutEffect(() => {
    const parent = tabsRef.current?.parentElement;
    const tabsTop = tabsRef.current?.offsetTop;

    if (parent?.scrollTop > tabsTop) {
      parent.scrollTop = tabsTop;
    }
  }, [selected]);

  useLayoutEffect(() => {
    tabsRef.current.parentElement.scrollTop = 0;
  }, []);

  return (
    <Box ref={tabsRef}>
      <Tabbar tabs={tabs} selected={selected} setSelected={setSelected} />

      <div style={s.scene}>
        <Component tab={route.key} {...extraProps} />
      </div>
    </Box>
  );
}

function Tabbar({ tabs, selected, setSelected }) {
  const theme = useTheme();
  const borderBottomColor = theme.colors.Primary;

  return (
    <Box style={s.tabbar} backgroundColor='Background'>
      {tabs.map((tab, index) => (
        <div
          key={tab.key}
          onClick={() => setSelected(index)}
          style={index === selected ? { ...s.tab, borderBottomColor } : s.tab}
        >
          <Text fontSize={18} color='PrimaryText'>
            {tab.title}
          </Text>
        </div>
      ))}
    </Box>
  );
}

const s = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
  } as any,
  tabbar: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    overflowY: 'hidden',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  } as any,
  tab: {
    padding: '4px 16px',
    cursor: 'pointer',
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
  } as any,
  scene: {
    minHeight: 'calc(100vh - 50px)',
  } as any,
};
