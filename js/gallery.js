// 画廊筛选功能
document.addEventListener('DOMContentLoaded', function() {
    // 等待画廊加载完成后再初始化筛选
    setTimeout(initGalleryFilters, 100);
});

function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            // 重新渲染符合筛选条件的项目
            if (filter === 'all') {
                await renderGalleryItems(galleryItems);
            } else {
                const filteredItems = galleryItems.filter(item => item.category === filter);
                await renderGalleryItems(filteredItems);
            }

            // 重新初始化灯箱
            initGalleryLightbox();
        });
    });
}

// 分类中英文映射
function getCategoryName(category) {
    const categoryMap = {
        'fanart': '插画',
        'emoji': '表情包',
        'comic': '漫画'
    };
    return categoryMap[category] || category;
}
