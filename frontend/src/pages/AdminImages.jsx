import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getAdminImageOverview,
  getAdminImagesList,
  verifyAdminImage,
  collectWestBengalPilot
} from '../services/api';
import SmartImage from '../components/common/SmartImage';

export default function AdminImages() {
  const [overview, setOverview] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState(null);

  const loadData = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const [overviewData, imagesData] = await Promise.all([
        getAdminImageOverview({ signal }),
        getAdminImagesList({ signal })
      ]);
      setOverview(overviewData);
      setImages(imagesData || []);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load image management data.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);
    return () => controller.abort();
  }, [loadData]);

  const handleSyncPilot = async () => {
    try {
      setSyncing(true);
      setActionNotice({ type: 'info', message: 'Syncing West Bengal Pilot images from Wikimedia Commons...' });
      const res = await collectWestBengalPilot();
      if (res && res.success) {
        setActionNotice({
          type: 'success',
          message: `Sync complete! Added: ${res.data?.added || 0}, Updated: ${res.data?.updated || 0}, Errors: ${res.data?.errors || 0}`
        });
        await loadData();
      } else {
        setActionNotice({ type: 'error', message: res.message || 'Pilot sync encountered an issue.' });
      }
    } catch (err) {
      setActionNotice({ type: 'error', message: err.message || 'Failed to sync pilot images.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleVerifyImage = async (imageId) => {
    try {
      setVerifyingId(imageId);
      const res = await verifyAdminImage(imageId);
      if (res && res.success) {
        setActionNotice({
          type: 'success',
          message: `Image #${imageId} verified successfully (${res.latencyMs || 0}ms).`
        });
        await loadData();
      } else {
        setActionNotice({
          type: 'error',
          message: `Image #${imageId} check failed: ${res.error || 'Unavailable'}`
        });
        await loadData();
      }
    } catch (err) {
      setActionNotice({ type: 'error', message: `Verification error: ${err.message}` });
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchesStatus = filterStatus === 'all' || img.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        (img.title && img.title.toLowerCase().includes(q)) ||
        (img.districtName && img.districtName.toLowerCase().includes(q)) ||
        (img.photographer && img.photographer.toLowerCase().includes(q)) ||
        (img.provider && img.provider.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [images, filterStatus, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
            Phase 1 Pilot: West Bengal Only
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: '4px 0 8px' }}>
            Centralized Image Management System (CIMS)
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '780px' }}>
            Zero-cost, database-driven online image architecture powered by Wikimedia Commons.
            Automated health verification, cross-district duplicate prevention, and self-healing fallback promotion.
          </p>
        </div>

        {/* Action Notice Banner */}
        {actionNotice && (
          <div
            style={{
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              background: actionNotice.type === 'error' ? 'rgba(255, 59, 48, 0.1)' : actionNotice.type === 'success' ? 'rgba(52, 199, 89, 0.12)' : 'var(--accent-light)',
              border: `1px solid ${actionNotice.type === 'error' ? 'rgba(255, 59, 48, 0.3)' : actionNotice.type === 'success' ? 'rgba(52, 199, 89, 0.3)' : 'var(--accent)'}`,
              color: actionNotice.type === 'error' ? '#d32f2f' : actionNotice.type === 'success' ? '#2e7d32' : 'var(--accent)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span style={{ fontWeight: 500 }}>{actionNotice.message}</span>
            <button
              onClick={() => setActionNotice(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'inherit' }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Overview Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'var(--bg-glass-heavy)', backdropFilter: 'blur(16px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase' }}>Total Images</span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
              {overview?.totalImages || images.length}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Active entities: {overview?.activeEntityImages || images.length}
            </span>
          </div>

          <div style={{ background: 'var(--bg-glass-heavy)', backdropFilter: 'blur(16px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase' }}>WB Pilot Districts</span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', marginTop: '4px' }}>
              {overview?.wbDistrictsConfigured || '23 / 23'}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              100% Unique Wikimedia IDs
            </span>
          </div>

          <div style={{ background: 'var(--bg-glass-heavy)', backdropFilter: 'blur(16px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase' }}>Verified Healthy</span>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#34c759', marginTop: '4px' }}>
              {overview?.statusCounts?.verified || images.filter(i => i.status === 'verified').length}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Broken: {overview?.statusCounts?.broken || images.filter(i => i.status === 'broken').length}
            </span>
          </div>

          <div style={{ background: 'var(--bg-glass-heavy)', backdropFilter: 'blur(16px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase' }}>Provider Policy</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
              Wikimedia Commons
            </div>
            <span style={{ fontSize: '0.8rem', color: '#34c759', fontWeight: 600 }}>
              $0.00 Cost • CC Open License
            </span>
          </div>
        </div>

        {/* Action Controls & Filters Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'verified', 'pending', 'broken'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: filterStatus === st ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: filterStatus === st ? 'var(--accent)' : 'var(--bg-glass-heavy)',
                  color: filterStatus === st ? '#ffffff' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search by district, title, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                background: 'var(--bg-glass)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                minWidth: '240px'
              }}
            />

            <button
              onClick={handleSyncPilot}
              disabled={syncing}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: syncing ? 'not-allowed' : 'pointer',
                opacity: syncing ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {syncing ? 'Syncing...' : 'Collect & Sync Pilot'}
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ background: 'var(--bg-glass-heavy)', backdropFilter: 'blur(16px)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ width: '36px', height: '36px', border: '3px solid rgba(0, 113, 227, 0.2)', borderTopColor: 'var(--accent)', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Loading image registry...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <p style={{ color: '#d32f2f', fontWeight: 600 }}>{error}</p>
              <button onClick={() => loadData()} style={{ marginTop: '12px', padding: '8px 16px', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                Retry
              </button>
            </div>
          ) : filteredImages.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>No images found matching your filter criteria.</p>
              <button onClick={handleSyncPilot} style={{ marginTop: '12px', padding: '8px 16px', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                Run Initial West Bengal Pilot Sync
              </button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '14px 16px' }}>Image</th>
                    <th style={{ padding: '14px 16px' }}>Target Entity</th>
                    <th style={{ padding: '14px 16px' }}>Role</th>
                    <th style={{ padding: '14px 16px' }}>Wikimedia Title & Author</th>
                    <th style={{ padding: '14px 16px' }}>License</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredImages.map((img) => {
                    const isVerifying = verifyingId === img.id;
                    return (
                      <tr key={img.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ width: '64px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#e5e5ea' }}>
                            <SmartImage
                              src={img.thumbnailUrl || img.url}
                              alt={img.title || 'Preview'}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {img.districtName || img.entityType || 'West Bengal'}
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 400 }}>
                            {img.entityType === 'district' ? 'District Card' : 'State Banner'}
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: img.imageRole === 'primary' ? 'var(--accent-light)' : 'rgba(0,0,0,0.05)', color: img.imageRole === 'primary' ? 'var(--accent)' : 'inherit', fontWeight: 600 }}>
                            {img.imageRole || 'primary'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px', maxWidth: '280px' }}>
                          <div style={{ fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {img.title || 'Wikimedia Image'}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            by {img.photographer || 'Wikimedia Contributor'}
                          </div>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(52, 199, 89, 0.1)', color: '#2e7d32', fontWeight: 600 }}>
                            {img.license || 'CC BY-SA 4.0'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              background:
                                img.status === 'verified'
                                  ? 'rgba(52, 199, 89, 0.12)'
                                  : img.status === 'broken'
                                  ? 'rgba(255, 59, 48, 0.12)'
                                  : 'rgba(255, 149, 0, 0.12)',
                              color:
                                img.status === 'verified'
                                  ? '#2e7d32'
                                  : img.status === 'broken'
                                  ? '#d32f2f'
                                  : '#f57c00',
                              fontWeight: 700,
                              textTransform: 'uppercase'
                            }}
                          >
                            {img.status || 'verified'}
                          </span>
                        </td>

                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleVerifyImage(img.id)}
                              disabled={isVerifying}
                              style={{
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'transparent',
                                border: '1px solid var(--accent)',
                                color: 'var(--accent)',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                cursor: isVerifying ? 'wait' : 'pointer',
                                opacity: isVerifying ? 0.6 : 1
                              }}
                            >
                              {isVerifying ? 'Checking...' : 'Verify'}
                            </button>

                            {img.sourcePageUrl && (
                              <a
                                href={img.sourcePageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: 'var(--radius-sm)',
                                  background: 'transparent',
                                  border: '1px solid var(--border)',
                                  color: 'var(--text-secondary)',
                                  fontSize: '0.8rem',
                                  textDecoration: 'none',
                                  fontWeight: 500
                                }}
                              >
                                Source ↗
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
