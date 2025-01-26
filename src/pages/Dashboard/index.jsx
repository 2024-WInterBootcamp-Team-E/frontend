// DashboardPage.jsx
import styled from 'styled-components';
import Layout from '@/components/Layout';
import { pretendard_bold } from '@/GlobalStyle';
import useAuthStore from '@/store/authStore';
import Attendance from '@/components/Attendance';
import DashboardGraphs from '@/components/DashboardGraphs';
import Button from '@/components/Button';
import { post } from '@/api';

const DashboardPage = () => {
	const { profile, setAuth } = useAuthStore();
	const userId = sessionStorage.getItem('userId');

	const postUserImage = async () => {
		try {
			const fileInput = document.createElement('input');
			fileInput.type = 'file';
			fileInput.accept = 'image/*';
			fileInput.onchange = async (event) => {
				const file = event.target.files[0];
				if (!file) return;

				const formData = new FormData();
				formData.append('file', file);
				try {
					const response = await post(`/user/${userId}/image`, formData, true);
					console.log('서버 응답:', response);
					setAuth(true, {
						image: response.data,
						name: profile.name,
						email: profile.email,
					});
				} catch (error) {
					console.error('이미지 업로드 오류:', error);
				}
			};
			fileInput.click();
		} catch (error) {
			console.error('postUserImage Error:', error);
		}
	};

	return (
		<Layout>
			<PageContainer>
				<CardGrid>
					<Card>
						<Button padding='none' rounded='full' onClick={postUserImage}>
							<ProfileImage src={profile?.image || '/EAStudy.png'} alt='Profile' />
						</Button>
						<div>
							<Nickname>{profile?.name}</Nickname>
							<p>{profile?.email || 'guest@example.com'}</p>
						</div>
					</Card>
					<HistoryCard>
						<CardTitle>My Attendance</CardTitle>
						<Attendance />
					</HistoryCard>
					<FeedbackCard>
						<CardTitle>My Histories</CardTitle>
						<DashboardGraphs />
					</FeedbackCard>
				</CardGrid>
			</PageContainer>
		</Layout>
	);
};

export default DashboardPage;

// 이하 스타일 정의
const PageContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: calc(100vh - 5rem);
	padding: 1rem;
	margin: 0;
	${pretendard_bold}
`;

const CardGrid = styled.div`
	/* 2개의 행, 높이는 자동 */
	grid-template-areas:
		'card1 card2'
		'card3 card3';
	/* 아래 열을 병합 */
	width: 100%;
	/* 첫 번째 열은 1배 크기, 두 번째 열은 2배 크기 */
	grid-template-rows: repeat(2, 1fr);
	/* 카드 간 간격 */
	/* 화면 너비 꽉 채우기 */
	height: 100%;
	/* 화면 높이 꽉 채우기 */
	gap: 2rem;
	display: grid;
	grid-template-columns: 1fr 3fr;
`;

const Card = styled.div`
	position: relative;
	overflow: hidden;
	border-radius: 1rem;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	background-color: var(--neutral-10);
	padding: 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	&:nth-child(1) {
		grid-area: card1;
	}
`;

const HistoryCard = styled(Card)`
	grid-area: card2;
	justify-content: start;
	align-items: flex-start;
`;

const FeedbackCard = styled(Card)`
	grid-area: card3;
	align-items: flex-start;
`;

const CardTitle = styled.h2`
	font-size: 1.5rem;
	font-weight: bold;
	text-align: left;
	width: 100%;
	text-align: start;
`;

const ContentBox = styled.div`
	width: 100%;
	height: calc(100% - 4rem);
	background-color: ${(props) => props.bgColor || '#ffffff'};
	border-radius: 0.5rem;
`;

const ProfileImage = styled.img`
	width: 13rem;
	height: 13rem;
	border-radius: 50%;
	object-fit: cover;
	object-position: center;
	background-color: var(--neutral-20);
	box-shadow: 0rem 0rem 1rem var(--neutral-20);
`;

const Nickname = styled.h3`
	font-size: 1.5rem;
	font-weight: bold;
	margin: 0;
`;
