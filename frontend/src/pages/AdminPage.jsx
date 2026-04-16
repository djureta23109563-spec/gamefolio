import { useState, useEffect } from 'react';
import API from '../api/axios';
import styles from '../styles/AdminPage.module.css';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalAction, setModalAction] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users');
    }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/admin/posts');
      setPosts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const { data } = await API.put(`/admin/users/${userId}/status`);
      setUsers(users.map(u => u._id === userId ? data.user : u));
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Failed to update user status');
    }
  };

  const handleRemovePost = async (postId) => {
    try {
      await API.put(`/admin/posts/${postId}/remove`);
      setPosts(posts.map(p => p._id === postId ? { ...p, status: 'removed' } : p));
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Failed to remove post');
    }
  };

  const confirmAction = (item, action) => {
    setSelectedItem(item);
    setModalAction(action);
    setShowConfirmModal(true);
  };

  const executeAction = () => {
    if (modalAction === 'toggleStatus') {
      handleToggleStatus(selectedItem._id);
    } else if (modalAction === 'removePost') {
      handleRemovePost(selectedItem._id);
    }
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const publishedPosts = posts.filter(p => p.status === 'published').length;
  const removedPosts = posts.filter(p => p.status === 'removed').length;

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading Game Data...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      {/* Gaming Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.gameIcon}>🎮</div>
          <h3>Game<span className={styles.logoHighlight}>Folio</span></h3>
          <div className={styles.logoBadge}>ADMIN</div>
        </div>
        <nav className={styles.sidebarNav}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.activeNav : ''}`}
          >
            <span className={styles.navIcon}>📊</span>
            <span className={styles.navText}>Dashboard</span>
            {activeTab === 'dashboard' && <span className={styles.navBadge}>HQ</span>}
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`${styles.navItem} ${activeTab === 'users' ? styles.activeNav : ''}`}
          >
            <span className={styles.navIcon}>👥</span>
            <span className={styles.navText}>Gamers</span>
            {activeTab === 'users' && <span className={styles.navBadge}>{users.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('posts')} 
            className={`${styles.navItem} ${activeTab === 'posts' ? styles.activeNav : ''}`}
          >
            <span className={styles.navIcon}>📝</span>
            <span className={styles.navText}>Game Posts</span>
            {activeTab === 'posts' && <span className={styles.navBadge}>{posts.length}</span>}
          </button>
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.serverStatus}>
            <span className={styles.statusDot}></span>
            <span>Server Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Game Control Panel</h1>
            <p className={styles.welcomeText}>Welcome back, Game Master! 🎮</p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.headerStat}>
              <span className={styles.headerStatValue}>{users.length + posts.length}</span>
              <span className={styles.headerStatLabel}>Total Activity</span>
            </div>
          </div>
        </div>

        {/* Gaming Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statCardGlow}`}>
            <div className={styles.statCardIcon}>🎮</div>
            <div className={styles.statValue}>{users.length}</div>
            <div className={styles.statLabel}>Total Gamers</div>
            <div className={styles.statProgress}>
              <div className={styles.progressBar} style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardIcon}>🟢</div>
            <div className={styles.statValue}>{activeUsers}</div>
            <div className={styles.statLabel}>Active Players</div>
            <div className={styles.statProgress}>
              <div className={styles.progressBar} style={{ width: `${(activeUsers/users.length)*100 || 0}%` }}></div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardIcon}>🔴</div>
            <div className={styles.statValue}>{inactiveUsers}</div>
            <div className={styles.statLabel}>Inactive Players</div>
            <div className={styles.statProgress}>
              <div className={styles.progressBar} style={{ width: `${(inactiveUsers/users.length)*100 || 0}%` }}></div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardIcon}>📝</div>
            <div className={styles.statValue}>{posts.length}</div>
            <div className={styles.statLabel}>Total Posts</div>
            <div className={styles.statProgress}>
              <div className={styles.progressBar} style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardIcon}>✅</div>
            <div className={styles.statValue}>{publishedPosts}</div>
            <div className={styles.statLabel}>Published</div>
            <div className={styles.statProgress}>
              <div className={styles.progressBar} style={{ width: `${(publishedPosts/posts.length)*100 || 0}%` }}></div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statCardIcon}>🗑️</div>
            <div className={styles.statValue}>{removedPosts}</div>
            <div className={styles.statLabel}>Removed</div>
            <div className={styles.statProgress}>
              <div className={styles.progressBar} style={{ width: `${(removedPosts/posts.length)*100 || 0}%` }}></div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.actionBar}>
          <div className={styles.sectionTitle}>
            {activeTab === 'users' && '🎮 Gamer Registry'}
            {activeTab === 'posts' && '📝 Game Posts Feed'}
            {activeTab === 'dashboard' && '🎯 Mission Control'}
            <span className={styles.sectionBadge}>
              {activeTab === 'users' ? users.length : activeTab === 'posts' ? posts.length : 'Active'}
            </span>
          </div>
          {(activeTab === 'users' || activeTab === 'posts') && (
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder={`Search ${activeTab === 'users' ? 'gamers...' : 'game posts...'}`}
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className={styles.dashboardGrid}>
            <div className={styles.dashboardCard}>
              <div className={styles.dashboardCardIcon}>🎯</div>
              <h3>Quick Actions</h3>
              <div className={styles.quickActions}>
                <button onClick={() => setActiveTab('users')} className={styles.quickBtn}>Manage Gamers</button>
                <button onClick={() => setActiveTab('posts')} className={styles.quickBtn}>Review Posts</button>
              </div>
            </div>
            <div className={styles.dashboardCard}>
              <div className={styles.dashboardCardIcon}>📊</div>
              <h3>System Status</h3>
              <div className={styles.statusList}>
                <div className={styles.statusItem}>
                  <span>Database</span>
                  <span className={styles.statusOnline}>Online</span>
                </div>
                <div className={styles.statusItem}>
                  <span>API Server</span>
                  <span className={styles.statusOnline}>Online</span>
                </div>
                <div className={styles.statusItem}>
                  <span>Storage</span>
                  <span className={styles.statusOnline}>Healthy</span>
                </div>
              </div>
            </div>
            <div className={styles.dashboardCard}>
              <div className={styles.dashboardCardIcon}>🏆</div>
              <h3>Achievements</h3>
              <div className={styles.achievementList}>
                <div className={styles.achievementItem}>🎖️ {users.length} Gamers Recruited</div>
                <div className={styles.achievementItem}>📝 {posts.length} Posts Created</div>
                <div className={styles.achievementItem}>⭐ Level {Math.floor(users.length / 10) + 1} Admin</div>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className={styles.tableContainer}>
            {filteredUsers.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>👾</div>
                <p>No gamers found</p>
                <p className={styles.emptyHint}>Try a different search term</p>
              </div>
            ) : (
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Gamer</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className={styles.userDetails}>
                            <span className={styles.userName}>{user.name}</span>
                            <span className={styles.userRole}>
                              {user.role === 'admin' ? '👑 Admin' : '🎮 Gamer'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={styles.userEmail}>{user.email}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${user.status === 'active' ? styles.statusActive : styles.statusInactive}`}>
                          {user.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </td>
                      <td className={styles.joinDate}>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => confirmAction(user, 'toggleStatus')}
                              className={`${styles.btnIcon} ${styles.btnDeactivate}`}
                              title="Deactivate Gamer"
                            >
                              🔴
                            </button>
                          ) : (
                            <button
                              onClick={() => confirmAction(user, 'toggleStatus')}
                              className={`${styles.btnIcon} ${styles.btnActivate}`}
                              title="Activate Gamer"
                            >
                              🟢
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Posts Table */}
        {activeTab === 'posts' && (
          <div className={styles.tableContainer}>
            {filteredPosts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📭</div>
                <p>No game posts found</p>
              </div>
            ) : (
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>Post Title</th>
                    <th>Author</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map(post => (
                    <tr key={post._id}>
                      <td>
                        <div className={styles.postTitle}>
                          {post.title}
                          {post.body && (
                            <div className={styles.postExcerpt}>
                              {post.body.substring(0, 60)}...
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{post.author?.name || 'Unknown'}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${post.status === 'published' ? styles.statusPublished : styles.statusRemoved}`}>
                          {post.status === 'published' ? '✅ Published' : '❌ Removed'}
                        </span>
                      </td>
                      <td className={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          {post.status === 'published' && (
                            <button
                              onClick={() => confirmAction(post, 'removePost')}
                              className={`${styles.btnIcon} ${styles.btnRemove}`}
                              title="Remove Post"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirmModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>⚠️</div>
            <h3>Confirm Action</h3>
            <p>
              {modalAction === 'toggleStatus' 
                ? `Are you sure you want to ${selectedItem?.status === 'active' ? 'deactivate' : 'activate'} ${selectedItem?.name}?`
                : `Are you sure you want to remove "${selectedItem?.title}"? This action cannot be undone.`
              }
            </p>
            <div className={styles.modalButtons}>
              <button className={styles.modalCancel} onClick={() => setShowConfirmModal(false)}>
                Cancel
              </button>
              <button className={styles.modalConfirm} onClick={executeAction}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;