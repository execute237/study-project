function tabs (tabsParentSelector, tabsSelector, tabsContentSelector, activeSelector) {
    const tabsParent = document.querySelector(tabsParentSelector),
          tabs = document.querySelectorAll(tabsSelector),
          tabContent = document.querySelectorAll (tabsContentSelector);

    function hideContent () {
        tabContent.forEach (item => {
            item.classList.add ('hide');
            item.classList.remove ('show');
        });
        tabs.forEach (item => {
            item.classList.remove (activeSelector);
        });
    }

    function showContent (i = 0) {
        tabContent[i].classList.add ('show');
        tabContent[i].classList.remove ('hide');
        tabs[i].classList.add (activeSelector);
    }


    tabsParent.addEventListener ('click', (e) => {
        const target = e.target;
        if (target && target.classList.contains (tabsSelector.slice(1))) {
            tabs.forEach ((item,i) => {
                if (target == item) {

                    hideContent();
                    showContent(i);
                }
            });
        }
    });

    hideContent ();
    showContent();
}

export default tabs;