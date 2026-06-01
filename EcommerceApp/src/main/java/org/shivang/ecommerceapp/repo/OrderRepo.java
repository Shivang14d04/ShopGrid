package org.shivang.ecommerceapp.repo;

import org.shivang.ecommerceapp.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order,Long> {
   Optional<Order> findByOrderId(String orderId);

   List<Order> findAllByOrderByOrderDateDesc();

   List<Order> findByUserUsernameOrderByOrderDateDesc(String username);
}
