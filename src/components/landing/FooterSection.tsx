import { styled } from 'styled-components'
import { useTranslation } from 'react-i18next'

import homeArrow from '@/assets/images/home_icon_arrow.png'
import frameArrow from '@/assets/images/Frame.png'

export default function FooterSection() {
  const { t } = useTranslation()
  return (
    <FooterWrapper>
      <FooterInner>
        {/* BRAND */}
        <BrandRow>
          <BrandLogoBox>
            <BrandLogo src={homeArrow} alt="NOFX Logo" />
          </BrandLogoBox>
          <BrandInfo>
            <BrandTitle>NOFX</BrandTitle>
            <BrandSubtitle>{t('futureStandardAI')}</BrandSubtitle>
          </BrandInfo>
        </BrandRow>

        {/* Multi-link columns */}
        <LinksGrid>
          {/* Column 1 */}
          <Column>
            <ColumnTitle>{t('links')}</ColumnTitle>
            <List>
              <li>
                <StyledLink href="https://github.com/tinkle-community/nofx" target="_blank">
                  GitHub
                </StyledLink>
              </li>
              <li>
                <StyledLink href="https://t.me/nofx_dev_community" target="_blank">
                  Telegram
                </StyledLink>
              </li>
              <li>
                <StyledLink href="https://x.com/nofx_ai" target="_blank">
                  X (Twitter)
                </StyledLink>
              </li>
            </List>
          </Column>

          {/* Column 2 */}
          <Column>
            <ColumnTitle>{t('resources')}</ColumnTitle>
            <List>
              <li>
                <StyledLink href="https://github.com/tinkle-community/nofx/blob/main/README.md" target="_blank">
                  {t('documentation')}
                </StyledLink>
              </li>
              <li>
                <StyledLink href="https://github.com/tinkle-community/nofx/issues" target="_blank">
                  Issues
                </StyledLink>
              </li>
              <li>
                <StyledLink href="https://github.com/tinkle-community/nofx/pulls" target="_blank">
                  Pull Requests
                </StyledLink>
              </li>
            </List>
          </Column>

          {/* Column 3 */}
          <Column>
            <ColumnTitle>{t('supporters')}</ColumnTitle>
            <List>
              <li>
                <StyledLink href="https://www.asterdex.com/en/referral/fdfc0e" target="_blank">
                  Aster DEX
                </StyledLink>
              </li>
              <li>
                <StyledLink href="https://www.maxweb.red/join?ref=NOFXAI" target="_blank">
                  Binance
                </StyledLink>
              </li>
              <li>
                <StyledLink href="https://hyperliquid.xyz/" target="_blank">
                  Hyperliquid
                </StyledLink>
              </li>
              <li>
                <StyledLink href="https://amber.ac/" target="_blank">
                  Amber.ac <LightText>{t('strategicInvestment')}</LightText>
                </StyledLink>
              </li>
            </List>
          </Column>
        </LinksGrid>

        {/* Bottom text */}
        <BottomNote>
          <p>{t('footerTitle')}</p>
          <BottomNoteWarning>
            <img src={frameArrow} alt="" />
            <span>{t('footerWarning')}</span>
          </BottomNoteWarning>
        </BottomNote>
      </FooterInner>
    </FooterWrapper>
  )
}

const FooterWrapper = styled.footer`
  border-top: 1px solid var(--panel-border);
`

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`

const BrandLogo = styled.img`
  width: 40px;
  height: 40px;
`

const BrandLogoBox = styled.div`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #0d4751;
`

const BrandInfo = styled.div``

const BrandTitle = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
`

const BrandSubtitle = styled.div`
  font-size: 0.75rem;
`

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  gap: 32px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const Column = styled.div``

const ColumnTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 12px;
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.875rem;
`

const StyledLink = styled.a`
  transition: color 0.2s;

  &:hover {
    color: var(--brand-green);
  }
`

const LightText = styled.span`
  opacity: 0.7;
`

const BottomNote = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-tertiary);
  border-top: 1px solid var(--panel-border);
`

const BottomNoteWarning = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 1rem;
    height: 1rem;
  }
`
