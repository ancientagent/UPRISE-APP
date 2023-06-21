import { StyleSheet, Platform } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  memberImageView: {
    alignItems: 'center',
    marginRight: 28,
    width: 80,
    marginVertical: 14,
  },
  memberImageStyle: {
    height: 80,
    width: 80,
    backgroundColor: Colors.iconBgColor,
    borderRadius: 80,
  },
  memberTextStyle: {
    textAlign: 'center',
    marginTop: 14,
    fontSize: 14,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.labelColor,
  },
  albumsImageView: {
    marginHorizontal: 7,
    width: 148,
    marginVertical: 10,
  },
  albumsImage: {
    height: 148,
    width: 148,
  },
  SongTextStyle: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.labelColor,
    width: '90%',
  },
  albumsTextStyle: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.labelColor,
  },
  AlbumNameView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  AlbumTitle: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.AlbumTitleColor,
  },
  miniPlayerView: {
    height: 150,
    backgroundColor: Colors.Black,
  },
  bandDetailsView: {
    height: Platform.OS === 'ios' ? '85.5%' : '83%',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  bandImage: {
    height: 234,
    width: '100%',
  },
  bandNameText: {
    marginTop: 25,
    marginHorizontal: 24,
    fontSize: 16,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.sideHeadingText,
  },
  bandNameView: {
    marginHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bandTitleView: {
    marginHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bandTitle: {
    marginTop: 6,
    fontSize: 16,
    fontFamily: 'Oswald Bold',
    fontWeight: '800',
    color: Colors.labelColor,
  },
  followbtnView: {
    backgroundColor: Colors.URbtnColor,
    borderRadius: 20,
  },
  unfollowbtnView: {
    backgroundColor: Colors.URbtnBgColor,
    borderRadius: 20,
  },
  followbtn: {
    marginVertical: 5,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unfollowText: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    marginLeft: 5,
    color: Colors.labelColor,
  },
  followText: {
    fontSize: 12,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    marginLeft: 5,
    color: Colors.Black,
  },
  membersView: {
    marginTop: 10,
    marginLeft: 7,
  },
  membersText: {
    fontSize: 16,
    marginHorizontal: 17,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.sideHeadingText,
  },
  AlbumsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 24,
  },
  AlbumsText: {
    fontSize: 16,
    marginLeft: 24,
    fontFamily: 'Oswald Regular',
    fontWeight: '400',
    color: Colors.sideHeadingText,
  },
  seeallText: {
    fontFamily: 'Oswald Medium',
    fontWeight: '500',
    fontSize: 12,
    color: Colors.labelColor,
  },
});
