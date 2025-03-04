import { FC, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Tippy from '@tippyjs/react';
import BigNumber from 'bignumber.js';

import { Synth } from 'lib/synthetix';

import { GasPrices } from 'queries/network/useEthGasPriceQuery';

import { CurrencyKey } from 'constants/currency';

import { secondsToTime } from 'utils/formatters/date';

import Button from 'components/Button';
import { DesktopOnlyView, MobileOrTabletView } from 'components/Media';
import Card from 'components/Card';

import { formatPercent } from 'utils/formatters/number';

import { MessageContainer } from '../common';

import { SummaryItems, SummaryItem, SummaryItemValue, SummaryItemLabel } from '../common';

import GasPriceSummaryItem from './GasPriceSummaryItem';
import TotalTradePriceSummaryItem from './TotalTradePriceSummaryItem';
import FeeRateSummaryItem from './FeeRateSummaryItem';
import FeeCostSummaryItem from './FeeCostSummaryItem';

type TradeSummaryCardProps = {
	submissionDisabledReason: ReactNode;
	baseCurrencyAmount: string;
	onSubmit: () => void;
	totalTradePrice: string | null;
	basePriceRate: number;
	baseCurrency: Synth | null;
	gasPrices: GasPrices | undefined;
	feeReclaimPeriodInSeconds: number;
	quoteCurrencyKey: CurrencyKey | null;
	showFee?: boolean;
	attached?: boolean;
	className?: string;
	feeRate: BigNumber | null;
	transactionFee?: number | null;
	feeCost: BigNumber | null;
	isApproved?: boolean;
	isCreateShort?: boolean;
	shortInterestRate?: BigNumber | null;
};

const TradeSummaryCard: FC<TradeSummaryCardProps> = ({
	submissionDisabledReason,
	baseCurrencyAmount,
	onSubmit,
	totalTradePrice,
	basePriceRate,
	baseCurrency,
	gasPrices,
	feeReclaimPeriodInSeconds,
	quoteCurrencyKey,
	showFee = true,
	attached,
	feeRate,
	transactionFee,
	feeCost,
	isApproved = true,
	isCreateShort = false,
	shortInterestRate = null,
	...rest
}) => {
	const { t } = useTranslation();

	const isSubmissionDisabled = useMemo(() => (submissionDisabledReason != null ? true : false), [
		submissionDisabledReason,
	]);

	const summaryItems = (
		<SummaryItems attached={attached}>
			<GasPriceSummaryItem gasPrices={gasPrices} transactionFee={transactionFee} />
			<SummaryItem>
				{isCreateShort ? (
					<>
						<SummaryItemLabel>{t('shorting.common.interestRate')}</SummaryItemLabel>
						<SummaryItemValue data-testid="short-interest-rate">
							{formatPercent((shortInterestRate ?? 0).toString())}
						</SummaryItemValue>
					</>
				) : (
					<TotalTradePriceSummaryItem totalTradePrice={totalTradePrice} />
				)}
			</SummaryItem>
			{showFee && (
				<>
					<FeeRateSummaryItem feeRate={feeRate} />
					<FeeCostSummaryItem feeCost={feeCost} />
				</>
			)}
		</SummaryItems>
	);

	return (
		<>
			<MobileOrTabletView>
				<MobileCard className="trade-summary-card">
					<Card.Body>{summaryItems}</Card.Body>
				</MobileCard>
			</MobileOrTabletView>
			<MessageContainer attached={attached} className="footer-card" {...rest}>
				<DesktopOnlyView>{summaryItems}</DesktopOnlyView>
				<ErrorTooltip
					visible={feeReclaimPeriodInSeconds > 0}
					placement="top"
					content={
						<div>
							{t('exchange.errors.fee-reclamation', {
								waitingPeriod: secondsToTime(feeReclaimPeriodInSeconds),
								currencyKey: quoteCurrencyKey,
							})}
						</div>
					}
				>
					<span>
						<Button
							variant="primary"
							isRounded={true}
							disabled={isSubmissionDisabled}
							onClick={onSubmit}
							size="lg"
							data-testid="submit-order"
						>
							{isSubmissionDisabled
								? submissionDisabledReason
								: !isApproved
								? t('exchange.summary-info.button.approve')
								: t('exchange.summary-info.button.submit-order')}
						</Button>
					</span>
				</ErrorTooltip>
			</MessageContainer>
		</>
	);
};

export const ErrorTooltip = styled(Tippy)`
	font-size: 12px;
	background-color: ${(props) => props.theme.colors.red};
	color: ${(props) => props.theme.colors.white};
	.tippy-arrow {
		color: ${(props) => props.theme.colors.red};
	}
`;

export const MobileCard = styled(Card)`
	margin: 0 auto 86px auto;
`;

export default TradeSummaryCard;
