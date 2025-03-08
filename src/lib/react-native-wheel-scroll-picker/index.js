import React from 'react';
import styled from 'styled-components';
import {View, Text, ScrollView, Dimensions, Platform} from 'react-native';
import PropTypes from 'prop-types';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

function customDebounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const Container = styled.View`
  height: ${props => props.wrapperHeight};
  flex: 1;
  overflow: hidden;
  align-self: center;
  width: ${props => props.wrapperWidth};
  background-color: ${props => props.wrapperBackground};
`;
export const HighLightView = styled.View`
  position: absolute;
  top: ${props => (props.wrapperHeight - props.itemHeight) / 2};
  height: ${props => props.itemHeight};
  width: ${props => props.highlightWidth};
  border-top-color: ${props => props.highlightColor};
  border-bottom-color: ${props => props.highlightColor};
  border-top-width: ${props => props.highlightBorderWidth}px;
  border-bottom-width: ${props => props.highlightBorderWidth}px;
`;
export const SelectedItem = styled.View`
  height: 30px;
  justify-content: center;
  align-items: center;
  height: ${props => props.itemHeight};
`;

const MINUTES = ['00', '30', '-'];
const HALF_MINUTES = ['30', '-'];

const deviceWidth = Dimensions.get('window').width;
export default class ScrollPicker extends React.Component {
  constructor() {
    super();
    this.onMomentumScrollBegin = this.onMomentumScrollBegin.bind(this);
    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);
    this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
    this.onScrollEndDrag = this.onScrollEndDrag.bind(this);
    this.state = {
      selectedIndex: 0,
    };
  }

  componentDidMount() {
    if (this.props.selectedIndex) {
      this.scrollToIndex(this.props.selectedIndex);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedIndex !== prevProps.selectedIndex) {
      this.scrollToIndex(this.props.selectedIndex);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    const {header, footer} = this.renderPlaceHolder();
    return (
      <Container
        wrapperHeight={this.props.wrapperHeight}
        wrapperWidth={this.props.wrapperWidth}
        wrapperBackground={this.props.wrapperBackground}>
        <HighLightView
          highlightColor={this.props.highlightColor}
          highlightWidth={this.props.highlightWidth}
          wrapperHeight={this.props.wrapperHeight}
          itemHeight={this.props.itemHeight}
          highlightBorderWidth={this.props.highlightBorderWidth}
        />
        <BottomSheetScrollView
          ref={sview => {
            this.sview = sview;
          }}
          bounces={false}
          showsVerticalScrollIndicator={false}
          onTouchStart={this.props.onTouchStart}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onScrollBeginDrag={this.onScrollBeginDrag}
          // scrollEventThrottle={26}
          onScroll={this.handleScroll}
          // onScrollEndDrag={this.onScrollEndDrag}
          // onScrollAnimationEnd={(ev)=>}
        >
          {header}
          {this.props.dataSource.map(this.renderItem.bind(this))}
          {footer}
        </BottomSheetScrollView>
      </Container>
    );
  }

  renderPlaceHolder() {
    const height = (this.props.wrapperHeight - this.props.itemHeight) / 2;
    const header = <View style={{height, flex: 1}}></View>;
    const footer = <View style={{height, flex: 1}}></View>;
    return {header, footer};
  }

  renderItem(data, index) {
    const isSelected = index === this.state.selectedIndex;
    const item = (
      <Text
        onPress={() => {
          const h = this.props.itemHeight;
          const verticalElem = index * h;
          if (Platform.OS === 'ios') {
            this.isScrollTo = true;
          }
          this.sview.scrollTo({
            y:
              this.props.dataSource[index] === '-'
                ? verticalElem - 60
                : verticalElem,
          });

          // setTimeout(()=> {
          this.props.onValueChange(data, index);
          this.setState({
            selectedIndex:
              this.props.dataSource[index] === '-' ? index - 1 : index,
          });
          // },10);
        }}
        style={
          isSelected
            ? {
                ...this.props.activeItemTextStyle,
                padding: 10,
                paddingHorizontal: 30,
              }
            : {...this.props.itemTextStyle, padding: 10, paddingHorizontal: 30}
        }>
        {data !== '-' ? data : ''}
      </Text>
    );

    return (
      <SelectedItem key={index} itemHeight={this.props.itemHeight}>
        {item}
      </SelectedItem>
    );
  }

  scrollFix(e) {
    let verticalY = 0;
    const h = this.props.itemHeight;
    if (e.nativeEvent.contentOffset) {
      verticalY = e.nativeEvent.contentOffset.y;
    }
    const selectedIndex = Math.round(verticalY / h);
    const verticalElem = selectedIndex * h;
    if (verticalElem !== verticalY) {
      // using scrollTo in ios, onMomentumScrollEnd will be invoked
      if (Platform.OS === 'ios') {
        this.isScrollTo = true;
      }
      if (this.sview) {
        //
        this.sview.scrollTo({
          y:
            this.props.dataSource[selectedIndex] === '-'
              ? verticalElem - 60
              : verticalElem,
        });
      }
    }
    if (this.state.selectedIndex === selectedIndex) {
      return;
    }

    this.setState({
      selectedIndex:
        this.props.dataSource[selectedIndex] === '-'
          ? selectedIndex - 1
          : selectedIndex,
    });
    // onValueChange
    if (this.props.onValueChange) {
      const selectedValue = this.props.dataSource[selectedIndex];
      this.props.onValueChange(selectedValue, selectedIndex);
    }
  }

  onScrollBeginDrag() {
    this.dragStarted = true;
    if (Platform.OS === 'ios') {
      this.isScrollTo = false;
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onScrollEndDrag(e) {
    this.props.onScrollEndDrag();
    this.dragStarted = false;
    // console.log(
    //   'e.nativeEvent.contentOffset.y, = ',
    //   e.nativeEvent.contentOffset.y,
    // );
    // if not used, event will be garbaged
    const element = {
      nativeEvent: {
        contentOffset: {
          y: e.nativeEvent.contentOffset.y,
        },
      },
    };
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      if (!this.momentumStarted && !this.dragStarted) {
        this.scrollFix(element, 'timeout');
      }
    }, 500);
  }

  handleScroll = customDebounce(({nativeEvent}) => {
    const {contentOffset} = nativeEvent;
    const {y: newScrollY} = contentOffset;
    // setScrollY(newScrollY);

    this.props.onScrollEndDrag();
    this.dragStarted = false;
    // console.log('e.nativeEvent.contentOffset.y, = ', newScrollY);
    // if not used, event will be garbaged
    const element = {
      nativeEvent: {
        contentOffset: {
          y: newScrollY,
        },
      },
    };
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      if (!this.momentumStarted && !this.dragStarted) {
        this.scrollFix(element, 'timeout');
      }
    }, 50);
  }, 100); // Debounce selama 16 milidetik

  onMomentumScrollBegin() {
    this.momentumStarted = true;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onMomentumScrollEnd(e) {
    try {
      this.props.onMomentumScrollEnd();
      this.momentumStarted = false;

      if (!this.isScrollTo && !this.momentumStarted && !this.dragStarted) {
        this.scrollFix(e);
      }
    } catch (error) {}
  }

  scrollToIndex(ind) {
    this.setState({
      selectedIndex: ind,
    });

    if (this.props?.activeScreen === 'HOUR') {
      this.props.setListMinutes(ind);
    }

    const y = this.props.itemHeight * ind;
    setTimeout(() => {
      if (this.sview) {
        this.sview.scrollTo({y});
      }
    }, 500);
  }
}
ScrollPicker.propTypes = {
  style: PropTypes.object,
  dataSource: PropTypes.array,
  selectedIndex: PropTypes.number,
  onValueChange: PropTypes.func,
  isHalf: PropTypes.bool,
  renderItem: PropTypes.func,
  highlightColor: PropTypes.string,
  itemHeight: PropTypes.number,
  wrapperBackground: PropTypes.string,
  wrapperWidth: PropTypes.number,
  wrapperHeight: PropTypes.number,
  highlightWidth: PropTypes.number,
  highlightBorderWidth: PropTypes.number,
  itemTextStyle: PropTypes.object,
  activeItemTextStyle: PropTypes.object,
  onMomentumScrollEnd: PropTypes.func,
  onScrollEndDrag: PropTypes.func,
  setListMinutes: PropTypes.func,
  activeScreen: PropTypes.string,
};
ScrollPicker.defaultProps = {
  dataSource: [1, 2, 3],
  isHalf: true,
  itemHeight: 60,
  wrapperBackground: '#FFFFFF',
  wrapperHeight: 180,
  wrapperWidth: 150,
  highlightWidth: deviceWidth,
  highlightBorderWidth: 2,
  highlightColor: '#333',
  onMomentumScrollEnd: () => {},
  onScrollEndDrag: () => {},
  setListMinutes: () => {},
  activeScreen: '',
  itemTextStyle: {
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
    color: '#B4B4B4',
  },
  activeItemTextStyle: {
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
    color: '#222121',
  },
};
