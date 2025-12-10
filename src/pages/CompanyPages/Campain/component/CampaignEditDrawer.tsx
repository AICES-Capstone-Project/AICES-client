import React, { useEffect, useState } from 'react';
import CampaignCreateDrawer from './CampaignCreateDrawer';
import { campaignService } from '../../../../services/campaignService';
import { Spin, Card } from 'antd';

type Props = {
  open: boolean;
  onClose: () => void;
  campaignId?: number;
  onUpdated?: () => void;
};

const CampaignEditDrawer: React.FC<Props> = ({ open, onClose, campaignId, onUpdated }) => {
  const [initialValues, setInitialValues] = useState<any | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!open || !campaignId) return;
      setLoading(true);
      try {
        const resp = await campaignService.getCampaignById(Number(campaignId));
        const data = resp?.data || resp;
        if (!mounted) return;
        setInitialValues(data);
      } catch (err) {
        console.error('Failed to load campaign for edit', err);
        if (mounted) setInitialValues(undefined);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [open, campaignId]);

  // While loading show a small placeholder card (the actual drawer is in CampaignCreateDrawer)
  if (loading && open) {
    return (
      <Card style={{ maxWidth: 520, margin: '12px auto', textAlign: 'center' }}>
        <Spin />
      </Card>
    );
  }

  return (
    <CampaignCreateDrawer
      open={open}
      onClose={onClose}
      initialValues={initialValues}
      campaignId={campaignId}
      onUpdated={onUpdated}
    />
  );
};

export default CampaignEditDrawer;
