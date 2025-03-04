import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Img from 'react-optimized-image';

import { SYNTHS_MAP } from 'constants/currency';

// import SwapPreview from 'assets/svg/marketing/swap-preview.svg';
// import SwapPreviewMd from 'assets/svg/marketing/swap-preview-md.svg';
import P2CIcon from 'assets/svg/marketing/icon-p2c.svg';
import PermissionlessIcon from 'assets/svg/marketing/icon-permissionless.svg';
import RestrictionsIcon from 'assets/svg/marketing/icon-restrictions.svg';

import { FlexDivCol } from 'styles/common';

import media from 'styles/media';

import { StackSection, CenterSubHeader, Title, Copy } from '../common';
import useExchange from 'sections/exchange/hooks/useExchange';

const BENEFITS = [
	{
		id: 'peer-to-contract',
		image: <Img src={P2CIcon} alt="" />,
		title: 'homepage.benefits.peer-to-contract.title',
		copy: 'homepage.benefits.peer-to-contract.copy',
	},
	{
		id: 'trading-pair',
		image: <Img src={RestrictionsIcon} alt="" />,
		title: 'homepage.benefits.trading-pair.title',
		copy: 'homepage.benefits.trading-pair.copy',
	},
	{
		id: 'permissionless',
		image: <Img src={PermissionlessIcon} alt="" />,
		title: 'homepage.benefits.permissionless.title',
		copy: 'homepage.benefits.permissionless.copy',
	},
];

const Benefits = () => {
	const { t } = useTranslation();
	const { quoteCurrencyCard, baseCurrencyCard, footerCard } = useExchange({
		footerCardAttached: true,
		persistSelectedCurrencies: false,
		defaultQuoteCurrencyKey: SYNTHS_MAP.sBTC,
		defaultBaseCurrencyKey: SYNTHS_MAP.sETH,
	});

	return (
		<StackSection>
			<StyledCenterSubHeader>{t('homepage.benefits.title')}</StyledCenterSubHeader>
			<ExchangeCards>
				{quoteCurrencyCard}
				{baseCurrencyCard}
			</ExchangeCards>
			<ExchangeFooter>{footerCard}</ExchangeFooter>
			<BenefitContainer>
				{BENEFITS.map(({ id, image, title, copy }) => (
					<BenefitCard key={id}>
						{image}
						<StyledTitle>{t(title)}</StyledTitle>
						<Copy>{t(copy)}</Copy>
					</BenefitCard>
				))}
			</BenefitContainer>
		</StackSection>
	);
};

const ExchangeFooter = styled.div`
	width: 100%;
	.footer-card {
		padding: 16px 18px;
		width: 800px;
		max-width: unset;
	}
	${media.lessThan('md')`
		.footer-card {
			width: unset;
			position: unset;
			box-shadow: unset;
		}
		.trade-summary-card {
			margin-bottom: 24px;
		}
	`}
`;

const ExchangeCards = styled.div`
	display: grid;
	justify-content: center;
	grid-template-columns: 1fr 1fr;
	grid-gap: 2px;
	padding-bottom: 2px;

	.currency-card {
		width: 400px;
	}
	${media.lessThan('md')`
		width: 100%;
		justify-content: unset;
		grid-template-columns: unset;
		grid-template-rows: auto auto;
		.currency-card {
			width: 100%;
		}
		padding-bottom: 24px;
	`}
`;

export const ResponsiveImage = styled(Img)`
	width: 100%;
	max-width: 1200px;
`;

const StyledCenterSubHeader = styled(CenterSubHeader)`
	padding-bottom: 56px;
	max-width: 700px;
	${media.lessThan('lg')`
		max-width: 450px;
	`}
`;

const BenefitCard = styled(FlexDivCol)`
	align-items: flex-start;
	img {
		width: 64px;
		height: 64px;
	}
`;

const StyledTitle = styled(Title)`
	padding-bottom: 14px;
	padding-top: 40px;
`;

const BenefitContainer = styled.div`
	display: grid;
	grid-auto-flow: column;
	align-items: baseline;
	margin: 100px 0px 140px 0;
	grid-gap: 40px;
	${media.lessThan('md')`
		margin: 80px 0;
		grid-auto-flow: unset;
		grid-template-columns: repeat(2, 1fr);
	`}
	${media.lessThan('sm')`
		grid-gap: 50px;
		grid-template-columns: auto;
		margin: 56px 0px 80px 0;
	`}
`;

export default Benefits;
