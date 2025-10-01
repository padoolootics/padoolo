'use client';

import ProductSlider from '@/components/Slider/ProductSlider';
import React, { useState } from 'react';
import { Product } from '@/types/products';

// type Product = {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   // We no longer need a category field here
// };

type Props = {
  layout: 'tabbed' | 'grid2x2' | 'row4' | 'single' | 'center-tabbed' | undefined;
  tabs: string[];
  productsByTab: Record<string, Product[]>;
};

export default function ProductTabber({ layout, tabs, productsByTab }: Props) {
  const [selectedTab, setSelectedTab] = useState(tabs[0]); // Default to first tab
  // const noSpacesselectedTab = selectedTab.replace(/\s+/g, ''); 

  // console.log('selectedTab:', productsByTab[selectedTab], 'tabs', tabs, 'noSpacesselectedTab', noSpacesselectedTab );

  return (
    <ProductSlider
      onTabChange={setSelectedTab}
      layout={layout}
      tabs={tabs}
      selectedTab={selectedTab}
      products={productsByTab[selectedTab] || []}
    />
  );
}
